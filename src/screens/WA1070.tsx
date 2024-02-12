/**-------------------------------------------
 * A01-0070_新タグID参照(土壌)
 * WA1070
 * screens/WA1070.tsx
 * ---------------------------------------------*/
import FunctionHeader from '../components/FunctionHeader.tsx'; // Headerコンポーネントのインポート
import Footer from '../components/Footer.tsx'; // Footerコンポーネントのインポート
import {styles} from '../styles/CommonStyle.tsx'; // 共通スタイル
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {getInstance} from '../utils/Realm.tsx'; // realm.jsから関数をインポート
import messages from '../utils/messages.tsx';
import QRScanner from '../utils/QRScanner.tsx';
import ProcessingModal from '../components/Modal.tsx';
import {logUserAction, logScreen} from '../utils/Log.tsx';
import {useAlert} from '../components/AlertContext.tsx';
import {IFA0330} from '../utils/Api.tsx';
import {StackNavigationProp} from '@react-navigation/stack';
import {RNCamera} from 'react-native-camera';
import {RootList} from '../navigation/AppNavigator';
import {ApiResponse, IFA0330Response, IFA0330ResponseDtl} from '../types/type';
import {useRecoilState, useResetRecoilState, useSetRecoilState} from 'recoil';
import {WA1070DataState, WA1071BackState} from '../atom/atom.tsx';
// WA1070 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'WA1070'>;
interface Props {
  navigation: NavigationProp;
}
const WA1070 = ({navigation}: Props) => {
  const [wkplcTyp, setWkplcTyp] = useState<string>(''); //作業場所種類
  const [wkplc, setWkplc] = useState<string>(''); // 作業場所
  const [inputValue, setInputValue] = useState<string>(''); //新タグID入力値
  const [modalVisible, setModalVisible] = useState<boolean>(false); //処理中モーダルの状態
  const [showScannerTag, setShowScannerTag] = useState<boolean>(false); // カメラ表示用の状態
  const [inputVisible, setInputVisible] = useState<boolean>(false); // 新タグ欄入力値 表示・非表示
  const [isNext, setIsNext] = useState<boolean>(false); // 送信準備完了状態
  const [isViewNextButton, setIsViewNextButton] = useState<boolean>(false); // 次へボタン 表示・非表示
  const [isCannotRead, setIsCannotRead] = useState<boolean>(false); // 新タグID読み取りメッセージ
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null,
  ); //長押しタグ表示用
  const [WA1071back, setWA1071Back] = useRecoilState(WA1071BackState); // Recoil 戻る
  const setWA1070Data = useSetRecoilState(WA1070DataState); // Recoil 新タグID情報
  const reseWA1070Data = useResetRecoilState(WA1070DataState); //Recoilリセット
  const {showAlert} = useAlert();
  /************************************************
   * 初期表示設定
   ************************************************/
  //初期処理
  useEffect(() => {
    reset();
    contentsViews();
  }, []);

  //WA1071帰還処理
  useEffect(() => {
    if (WA1071back) {
      reset();
      // 遷移状態をリセット
      setWA1071Back(false);
      contentsViews();
    }
  }, [WA1071back]);

  // 画面表示前処理
  const contentsViews = async () => {
    const realm = getInstance();
    const loginInfo = realm.objects('login')[0];
    let place;
    switch (loginInfo.wkplacTyp) {
      case 4:
        setWkplcTyp('仮置場');
        place = realm.objects('temporary_places')[0];
        setWkplc(place.tmpPlacNm as string);
        break;
      case 5:
        setWkplcTyp('保管場');
        place = realm.objects('storage_places')[0];
        setWkplc(place.storPlacNm as string);
        break;
      case 6:
        setWkplcTyp('定置場');
        place = realm.objects('fixed_places')[0];
        setWkplc(place.fixPlacNm as string);
        break;
    }
  };

  // 値の初期化
  const reset = () => {
    reseWA1070Data();
    setIsCannotRead(false);
    setInputVisible(false);
    setInputValue('');
    setIsViewNextButton(false);
    setWkplc('');
    setWkplcTyp('');
    setIsNext(true);
  };

  // 10秒以上の長押しを検出
  const onPressIn = () => {
    // 10秒後に実行されるアクション
    const timer = setTimeout(() => {
      setInputVisible(true);
      setIsNext(false);
      setIsCannotRead(true);
      setIsViewNextButton(true);
    }, 10000); // 10秒 = 10000ミリ秒
    setLongPressTimer(timer); // タイマーIDを保存
  };

  // タッチ終了時のイベントハンドラ
  const onPressOut = () => {
    // タイマーが設定されていればクリア
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null); // タイマーIDをクリア
    }
  };

  // 送信ボタンのスタイルを動的に変更するための関数
  const getButtonStyle = () => {
    return isNext
      ? [styles.button, styles.startButton]
      : [styles.button, styles.startButton, styles.disabledButton];
  };

  // 新タグID読み取りメッセージ
  const getInfoMsg = () => {
    return isCannotRead
      ? '新タグIDが読み込めない場合：'
      : '新タグIDが読み込めない場合はここを長押しして下さい。';
  };

  // 入力値が変更されたときのハンドラー
  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  // 入力がフォーカスアウトされたときのハンドラー
  const handleInputBlur = async () => {
    // 入力値が空かどうかによってブール値ステートを更新
    setIsNext(inputValue !== '');
    // 正規表現チェック
    if (!checkFormat(inputValue)) {
      await showAlert('通知', messages.EA5017(inputValue), false);
      setIsNext(false);
      return;
    }
    // 一桁目チェック
    if (inputValue.startsWith('6') || inputValue.startsWith('8')) {
      await showAlert(
        '通知',
        messages.EA5022('土壌', '新タグ参照(灰)', inputValue),
        false,
      );
      setIsNext(false);
      return;
    }
  };

  /************************************************
   * フォーマットチェック
   ************************************************/
  const checkFormat = (data: string) => {
    const pattern = /^[0-9][2-5][0-9]0[0-9]{11}$/;
    return pattern.test(data);
  };

  /************************************************
   * コードスキャン後の処理 (タグ用)
   * @param param0
   * @returns
   ************************************************/
  const handleCodeScannedForTag = async (data: string, type: string) => {
    const parts = data.split(',');
    setShowScannerTag(false);
    let code = '';
    if (type !== RNCamera.Constants.BarCodeType.qr && type !== 'CODABAR') {
      await showAlert('通知', messages.EA5008(), false);
      return;
    } else if (
      type === RNCamera.Constants.BarCodeType.qr &&
      (parts.length === 1 || parts[0] !== 'CM')
    ) {
      await showAlert('通知', messages.EA5009(), false);
      return;
    } else if (
      type === RNCamera.Constants.BarCodeType.qr &&
      parts[0] === 'CM'
    ) {
      // --QRコード--
      // 新タグID参照処理実施(csvデータ2カラム目 新タグID)
      // モーダル表示
      setModalVisible(true);
      code = parts[1];
    } else if (type === 'CODABAR') {
      // --バーコード--
      // フォーマットチェック
      if (!checkFormat(data)) {
        await showAlert('通知', messages.EA5017(data), false);
        return;
      } else if (data.charAt(0) === '6' || data.charAt(0) === '8') {
        await showAlert(
          '通知',
          messages.EA5022('土壌', '新タグ参照(灰)', data),
          false,
        );
        return;
      }
      // モーダル表示
      setModalVisible(true);
      code = 'a' + data + 'a';
    } else {
      //イレギュラー
      //・CMから始まるバーコードもしくは
      //・1カラム目は非CMの複数カラムデータ
      await showAlert('通知', messages.EA5008(), false);
      return;
    }

    // 新タグID参照処理実施
    if (!(await procNewTagId(code))) {
      // モーダル非表示
      setModalVisible(false);
      setShowScannerTag(false);
      return;
    }

    // モーダル非表示
    setModalVisible(false);
    await logScreen('画面遷移: WA1070 → WA1071_新タグ参照(土壌)');
    navigation.navigate('WA1071');
  };
  // タグコードスキャンボタン押下時の処理
  const btnTagQr = async () => {
    await logUserAction('ボタン押下: WA1070 - タグ読込');
    setShowScannerTag(true);
  };

  /************************************************
   * 新タグ情報照会処理
   ************************************************/
  const procNewTagId = async (txtNewTagId: string): Promise<boolean> => {
    //通信を実施
    const responseIFA0330 = await IFA0330(txtNewTagId);
    if (await apiIsError(responseIFA0330)) {
      return false;
    }
    const data = responseIFA0330.data as IFA0330Response<IFA0330ResponseDtl>;
    const dataDtl = data.dtl[0] as IFA0330ResponseDtl;

    // oldTagId の値だけを抽出して新しい配列に格納する
    const oldTagIds = data.dtl.map(item => item.oldTagId);

    // 一時データ格納する
    setWA1070Data({
      head: {
        wkplcTyp: wkplcTyp,
        wkplc: wkplc,
        newTagId: txtNewTagId,
      },
      data: {
        newTagId: dataDtl.newTagId,
        rmSolTyp: dataDtl.rmSolTyp,
        pkTyp: dataDtl.pkTyp,
        splFac: dataDtl.splFac,
        tsuInd: dataDtl.tsuInd,
        usgInnBg: dataDtl.usgInnBg,
        usgAluBg: dataDtl.usgAluBg,
        yesNoOP: dataDtl.yesNoOP,
        caLgSdBgWt: dataDtl.caLgSdBgWt,
        caLgSdBgDs: dataDtl.caLgSdBgDs,
        estRa: dataDtl.estRa,
        lnkNewTagDatMem: dataDtl.lnkNewTagDatMem,
      },
      oldTag: {
        //---旧タグ---
        oldTagId: oldTagIds.length,
        oldTagIdList: oldTagIds as string[],
      },
    });
    return true;
  };

  /************************************************
   * 戻るボタン処理
   ************************************************/
  const btnAppBack = async () => {
    await logUserAction('ボタン押下: WA1070 - 戻る');
    await logScreen('画面遷移: WA1070 → WA1040_メニュー');
    navigation.navigate('WA1040');
  };

  /************************************************
   * 次へボタン処理
   ************************************************/
  const btnAppNext = async () => {
    await logUserAction('ボタン押下: WA1070 - 次へ');
    // モーダル表示
    setModalVisible(true);
    // 新タグID参照処理実施
    if (!(await procNewTagId('a' + inputValue + 'a'))) {
      // モーダル非表示
      setModalVisible(false);
      setShowScannerTag(false);
      return;
    }
    // モーダル非表示
    setModalVisible(false);
    await logScreen('画面遷移: WA1070 → WA1071_新タグ参照(土壌)');
    navigation.navigate('WA1071');
  };

  /************************************************
   * API通信処理エラー有無確認・エラーハンドリング
   * @param {*} response
   * @returns
   ************************************************/
  const apiIsError = async <T,>(response: ApiResponse<T>): Promise<boolean> => {
    if (!response.success) {
      switch (response.error) {
        case 'codeHttp200':
          await showAlert(
            '通知',
            messages.EA5004(response.api as string, response.status as number),
            false,
          );
          break;
        case 'codeRsps01':
          await showAlert(
            '通知',
            messages.EA5005(response.api as string, response.code as string),
            false,
          );
          break;
        case 'timeout':
          await showAlert('通知', messages.EA5003(), false);
          break;
        case 'zero': //取得件数0件の場合
          await showAlert('通知', messages.IA5015(), false);
          break;
      }
      return true;
    } else {
      return false;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={'padding'}
      style={styles.flex1} // KeyboardAvoidingView に flex: 1 を追加
      keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={[styles.containerWithKeybord, styles.flexGrow1]}>
        {/* ヘッダ */}
        <FunctionHeader
          appType={'現'}
          viewTitle={'新タグ読込'}
          functionTitle={'参照(土)'}
        />

        {/* 上段 */}
        <View style={[styles.main, styles.topContent]}>
          <Text style={[styles.labelText]}>作業場所：{wkplcTyp}</Text>
          <Text style={[styles.labelText, styles.labelTextPlace]}>{wkplc}</Text>
        </View>

        {/* 中段1 */}
        <View style={[styles.main, styles.middleContent]}>
          <Text style={styles.labelText}>
            下記ボタンを押してフレコンに取り付けられたタグを読み込んで下さい。
          </Text>
          <TouchableOpacity
            testID="tag-read-btn"
            style={[styles.button, styles.buttonSmall, styles.centerButton]}
            onPress={btnTagQr}>
            <Text style={styles.buttonText}>タグ読込</Text>
          </TouchableOpacity>
        </View>

        {/* 中段2 */}
        <View
          style={[
            styles.main,
            styles.topContent,
            styles.center,
            styles.zIndex,
          ]}>
          <TouchableWithoutFeedback
            testID="info-msg"
            onPressIn={() => onPressIn()}
            onPressOut={onPressOut}>
            <Text style={styles.labelText}>{getInfoMsg()}</Text>
          </TouchableWithoutFeedback>
          {inputVisible && (
            <View testID="input-container" style={[styles.inputContainer]}>
              <Text style={styles.inputWithText}>a</Text>
              <TextInput
                testID="text-input"
                style={styles.input}
                onChangeText={handleInputChange}
                onBlur={handleInputBlur}
                value={inputValue}
                maxLength={15}
              />
              <Text style={styles.inputWithText}>a</Text>
            </View>
          )}
        </View>
        <View style={styles.flex1} />
        {/* 下段 */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            testID="back-btn"
            style={[styles.button, styles.endButton]}
            onPress={btnAppBack}>
            <Text style={styles.endButtonText}>戻る</Text>
          </TouchableOpacity>
          {isViewNextButton && (
            <TouchableOpacity
              testID="next-btn"
              style={getButtonStyle()}
              onPress={btnAppNext}
              disabled={!isNext}>
              <Text style={styles.startButtonText}>次へ</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* フッタ */}
        <Footer />

        {/* 処理中モーダル */}
        <ProcessingModal
          visible={modalVisible}
          message={messages.IA5018()}
          onClose={() => setModalVisible(false)}
        />

        {/* タグ用QRコードスキャナー */}
        {showScannerTag && (
          <Modal
            testID="scaner-modal"
            visible={showScannerTag}
            onRequestClose={() => setShowScannerTag(false)}>
            <QRScanner
              onScan={handleCodeScannedForTag}
              closeModal={() => setShowScannerTag(false)}
              isActive={showScannerTag}
              errMsg={'タグ'}
            />
          </Modal>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default WA1070;
