/**-------------------------------------------
 * A01-0060_新タグID参照(土壌)
 * WA1066
 * screens/WA1066.tsx
 * ---------------------------------------------*/
import FunctionHeader from '../components/FunctionHeader.tsx'; // Headerコンポーネントのインポート
import Footer from '../components/Footer.tsx'; // Footerコンポーネントのインポート
import {styles} from '../styles/CommonStyle.tsx'; // 共通スタイル
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {logUserAction, logScreen} from '../utils/Log.tsx';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootList} from '../navigation/AppNavigator.tsx';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {
  WA1061BackState,
  WA1060PrevScreenId,
  WA1060DataState,
  WA1060NewTagIdState,
  WA1060CmnTagFlgState,
  WA1060OldTagInfosState,
  WA1063MemoAutoState,
  WA1060WkPlacState,
  WA1065MemoState,
  WA1060KbnState,
} from '../atom/atom.tsx';
import {useAlert} from '../components/AlertContext.tsx';
import messages from '../utils/messages.tsx';
import ProcessingModal from '../components/Modal.tsx';
import {ApiResponse, WA1060OldTagInfoConst} from '../types/type.tsx';
import {
  CT0007,
  CT0006,
  CT0005,
  CT0008,
  CT0009,
  CT0010,
  CT0011,
  CT0042,
} from '../enum/enums.tsx';
import {IFT0090} from '../utils/Api.tsx';
import PopupDetail from '../components/PopupDetail';
import {getCurrentDateTime} from '../utils/common.tsx';
// WA1066 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'WA1066'>;
interface Props {
  navigation: NavigationProp;
}
const WA1066 = ({navigation}: Props) => {
  const [lnkNewTagDatMem, setLnkNewTagDatMem] = useState<string>(''); // メモ
  const [modalVisible, setModalVisible] = useState<boolean>(false); //処理中モーダルの状態
  const [popupVisible, setPopupVisible] = useState<boolean>(false); // 詳細ポップアップ
  const [selectedOldTagInfo, setSelectedOldTagInfo] =
    useState<WA1060OldTagInfoConst | null>(null); // 詳細ポップアップ表示する旧タグ情報
  const newTagId = useRecoilValue(WA1060NewTagIdState); // Recoil 新タグID
  const WA1060OldTagInfos = useRecoilValue(WA1060OldTagInfosState); //Recoil 旧タグ情報
  const WA1063MemoAuto = useRecoilValue(WA1063MemoAutoState); // Recoil メモ自動
  const WA1065Memo = useRecoilValue(WA1065MemoState); // Recoil メモ
  const WA1060WkPlac = useRecoilValue(WA1060WkPlacState); // Recoil 作業場所情報
  const cmnTagFlg = useRecoilValue(WA1060CmnTagFlgState); //Recoil 共通タグフラグ
  const kbn = useRecoilValue(WA1060KbnState);
  const [WA1060Data, setWA1060Data] = useRecoilState(WA1060DataState); //Recoil 新タグ情報
  const setPrevScreenId = useSetRecoilState(WA1060PrevScreenId); // Recoil 遷移元画面ID
  const setBack = useSetRecoilState(WA1061BackState); // Recoil 戻る
  const {showAlert} = useAlert();

  /************************************************
   * 初期表示設定
   ************************************************/
  useEffect(() => {
    setLnkNewTagDatMem(WA1063MemoAuto + WA1065Memo);
  }, []);

  /************************************************
   * 破棄ボタン処理
   ************************************************/
  const btnAppDestroy = async () => {
    await logUserAction('ボタン押下: 破棄(WA1066)');
    const result = await showAlert('確認', messages.IA5012(), true);
    if (result) {
      setBack(true);
      setPrevScreenId('WA1040');
      await logScreen('画面遷移:WA1060_新タグ読込(土壌)');
      navigation.navigate('WA1060');
    }
  };

  /************************************************
   * 送信ボタン処理
   ************************************************/
  const btnAppSend = async () => {
    await logUserAction('ボタン押下: 送信(WA1066)');
    setModalVisible(true);
    const dateStr = getCurrentDateTime();
    //共通タグが2:新タグの場合 紐付登録日時を更新
    if (cmnTagFlg === '2') {
      setWA1060Data({
        ...WA1060Data,
        tyRegDt: dateStr, //紐付登録日時
      });
    }

    //メモの上限文字数以降カット
    if (lnkNewTagDatMem.length > 400) {
      setLnkNewTagDatMem(lnkNewTagDatMem.substring(0, 400));
    }

    //IFT0090実行
    const responseIFA0310 = await IFT0090(
      WA1060WkPlac,
      WA1060OldTagInfos,
      dateStr,
      newTagId,
      WA1060Data,
      lnkNewTagDatMem,
      kbn,
    );
    const result = await apiIsError(responseIFA0310);
    if (result) {
      await showAlert('通知', messages.IA5005('新タグの紐付'), false);
    }

    setModalVisible(false);
    //遷移元画面IDを設定
    setPrevScreenId('WA1040');
    await logScreen('画面遷移:WA1060_新タグ読込(土壌)');
    navigation.navigate('WA1060');
  };

  /************************************************
   * 必須情報編集ボタン処理
   ************************************************/
  const btnEdtReq = async () => {
    await logUserAction('ボタン押下: 必須情報編集(WA1066)');
    //遷移元画面IDを設定
    setPrevScreenId('WA1066');
    await logScreen('画面遷移:WA1063_必須情報設定(土壌)');
    navigation.navigate('WA1063');
  };

  /************************************************
   * 重量・線量編集ボタン処理
   ************************************************/
  const btnEdtWtDs = async () => {
    await logUserAction('ボタン押下: 重量・線量編集(WA1066)');
    //遷移元画面IDを設定
    setPrevScreenId('WA1066');
    await logScreen('画面遷移:WA1064_重量・線量(土壌)');
    navigation.navigate('WA1064');
  };

  /************************************************
   * メモ編集ボタン処理
   ************************************************/
  const btnEdtMemo = async () => {
    await logUserAction('ボタン押下: メモ編集(WA1066)');
    //遷移元画面IDを設定
    setPrevScreenId('WA1066');
    await logScreen('画面遷移:WA1065_メモ入力(土壌)');
    navigation.navigate('WA1065');
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
      }
      return true;
    } else {
      return false;
    }
  };

  /************************************************
   * 詳細データをレンダリングするための関数
   ************************************************/
  const renderDetailData = (oldTagInfo: WA1060OldTagInfoConst) => {
    return (
      <View style={styles.tableMain}>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>
              津波浸水：{CT0005[Number(oldTagInfo?.tsuInd)] ?? ''}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>
              特定施設：{CT0006[Number(oldTagInfo?.splFac)] ?? ''}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>
              除去土壌等種別：{CT0007[Number(oldTagInfo?.rmSolTyp)] ?? ''}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>
              発生土地分類：{CT0008[Number(oldTagInfo?.ocLndCla)] ?? ''}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>
              荷姿種別：{CT0009[Number(oldTagInfo?.pkTyp)] ?? ''}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>
              内袋の利用方法：{CT0010[Number(oldTagInfo?.usgInnBg)] ?? ''}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>
              アルミ内袋の利用：{CT0011[Number(oldTagInfo?.usgAluBg)] ?? ''}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>容積：{oldTagInfo?.vol}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>
              空間線量率：{oldTagInfo?.airDsRt}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>
              発生土地の利用区分：{oldTagInfo?.ocLndUseknd}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>発生場所：{oldTagInfo?.ocloc}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>備考(除去土壌情報)：</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>{oldTagInfo?.rmSolInf}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>除染時データメモ：</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>{oldTagInfo?.lnkNewTagDatMem}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={'padding'}
      style={styles.flex1}
      keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={[styles.containerWithKeybord, styles.flexGrow1]}>
        {/* ヘッダ */}
        <FunctionHeader
          appType={'現'}
          viewTitle={'登録内容確認'}
          functionTitle={'紐付(土)'}
        />
        {/* 上段 */}
        <View style={[styles.main]}>
          <Text style={[styles.labelText]}>
            作業場所：{WA1060WkPlac.wkplac}
          </Text>
          <Text style={[styles.labelText, styles.labelTextPlace]}>
            {WA1060WkPlac.wkplacNm}
          </Text>
          <Text style={[styles.labelText, styles.bold]}>
            新タグID：{newTagId}
          </Text>
          <Text style={[styles.labelText, styles.bold]}>
            旧タグ数：{WA1060OldTagInfos.length}
          </Text>

          <View style={styles.tableMain}>
            {WA1060OldTagInfos.map((oldTagInfo, index) => (
              <View key={index} style={styles.detailSection}>
                <View style={[styles.tableCell2]}>
                  <Text style={styles.labelText}>{`${index + 1}: ${
                    oldTagInfo.oldTag
                  }`}</Text>
                </View>
                <View style={[styles.tableCell1]}>
                  <TouchableOpacity
                    style={[styles.detailButton]}
                    onPress={async () => {
                      setSelectedOldTagInfo(oldTagInfo);
                      setPopupVisible(true);
                      await logUserAction(
                        'ボタン押下: 詳細(' + oldTagInfo.oldTag + ')(WA1061)',
                      );
                    }}>
                    <Text style={styles.detailButtonText}>詳細</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.tableMain}>
            <View style={[styles.tableRow, styles.pickerContainer]}>
              <View style={styles.tableCell}>
                <Text style={[styles.pickerLabelText, styles.alignRight]}>
                  除去土壌等種別：
                </Text>
              </View>
              <View style={[styles.tableCell]}>
                <Text style={styles.pickerLabelText}>
                  {CT0007[Number(WA1060Data.rmSolTyp)] ?? ''}
                </Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.pickerContainer]}>
              <View style={styles.tableCell}>
                <Text style={[styles.pickerLabelText, styles.alignRight]}>
                  荷姿種別：
                </Text>
              </View>
              <View style={[styles.tableCell]}>
                <Text style={styles.pickerLabelText}>
                  {CT0009[Number(WA1060Data.pkTyp)] ?? ''}
                </Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.pickerContainer]}>
              <View style={styles.tableCell}>
                <Text style={[styles.pickerLabelText, styles.alignRight]}>
                  内袋の利用方法：
                </Text>
              </View>
              <View style={[styles.tableCell]}>
                <Text style={styles.pickerLabelText}>
                  {CT0010[Number(WA1060Data.usgInnBg)] ?? ''}
                </Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.pickerContainer]}>
              <View style={styles.tableCell}>
                <Text style={[styles.pickerLabelText, styles.alignRight]}>
                  津波浸水域由来：
                </Text>
              </View>
              <View style={[styles.tableCell]}>
                <Text style={styles.pickerLabelText}>
                  {CT0005[Number(WA1060Data.tsuInd)] ?? ''}
                </Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.pickerContainer]}>
              <View style={styles.tableCell}>
                <Text style={[styles.pickerLabelText, styles.alignRight]}>
                  特定施設由来：
                </Text>
              </View>
              <View style={[styles.tableCell]}>
                <Text style={styles.pickerLabelText}>
                  {CT0006[Number(WA1060Data.splFac)] ?? ''}
                </Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.pickerContainer]}>
              <View style={styles.tableCell}>
                <Text style={[styles.pickerLabelText, styles.alignRight]}>
                  アルミ内袋の利用：
                </Text>
              </View>
              <View style={[styles.tableCell]}>
                <Text style={styles.pickerLabelText}>
                  {CT0011[Number(WA1060Data.usgAluBg)] ?? ''}
                </Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.pickerContainer]}>
              <View style={styles.tableCell}>
                <Text style={[styles.pickerLabelText, styles.alignRight]}>
                  オーバーパック有無：{CT0042[Number(WA1060Data.yesNoOP)] ?? ''}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.center, styles.updownMargin]}>
            <TouchableOpacity
              style={[styles.detailButton, styles.buttonHalf]}
              onPress={btnEdtReq}>
              <Text style={styles.detailButtonText}>必須情報編集</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableMain}>
            <View style={[styles.tableRow, styles.pickerContainer]}>
              <View style={styles.tableCell}>
                <Text style={[styles.pickerLabelText, styles.alignRight]}>
                  重量(Kg)：
                </Text>
              </View>
              <View style={[styles.tableCell]}>
                <Text style={styles.pickerLabelText}>
                  {WA1060Data.caLgSdBgWt ?? ''}
                </Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.pickerContainer]}>
              <View style={styles.tableCell}>
                <Text style={[styles.pickerLabelText, styles.alignRight]}>
                  線量(μSv/h)：
                </Text>
              </View>
              <View style={[styles.tableCell]}>
                <Text style={styles.pickerLabelText}>
                  {WA1060Data.caLgSdBgDs ?? ''}
                </Text>
              </View>
            </View>
            <View style={[styles.tableRow, styles.pickerContainer]}>
              <View style={styles.tableCell}>
                <Text style={[styles.pickerLabelText, styles.alignRight]}>
                  推定放射能濃度：
                </Text>
              </View>
              <View style={[styles.tableCell]}>
                <Text style={styles.pickerLabelText}>{WA1060Data.estRa}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.inputLabelText, styles.alignRight]}>
                  (Bq/Kg)　
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.inputLabelText} />
              </View>
            </View>
          </View>

          <View style={[styles.center, styles.updownMargin]}>
            <TouchableOpacity
              style={[styles.detailButton, styles.buttonHalf]}
              onPress={btnEdtWtDs}>
              <Text style={[styles.detailButtonText]}>重量・線量編集</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.tableRow, styles.pickerContainer]}>
            <View style={styles.tableCell}>
              <Text style={[styles.pickerLabelText]}>メモ：</Text>
            </View>
            <View style={styles.tableCell} />
          </View>

          <View style={styles.memoScrollContainer}>
            <View style={styles.memoScroll}>
              <ScrollView nestedScrollEnabled={true}>
                <Text style={[styles.memo, styles.textBlack]}>
                  {WA1063MemoAuto + WA1065Memo}
                </Text>
              </ScrollView>
            </View>
          </View>

          <View style={[styles.center, styles.updownMargin]}>
            <TouchableOpacity
              style={[styles.detailButton, styles.buttonHalf]}
              onPress={btnEdtMemo}>
              <Text style={[styles.detailButtonText]}>メモ編集</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* 下段 */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.button, styles.destroyButton]}
            onPress={btnAppDestroy}>
            <Text style={styles.endButtonText}>破棄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.startButton, styles.buttonMaxHalf]}
            onPress={btnAppSend}>
            <Text style={styles.startButtonText}>送信</Text>
          </TouchableOpacity>
        </View>
        {/* フッタ */}
        <Footer />
        {/* 処理中モーダル */}
        <ProcessingModal
          visible={modalVisible}
          message={messages.IA5018()}
          onClose={() => setModalVisible(false)}
        />

        {/* 詳細ポップアップ */}
        <PopupDetail
          isVisible={popupVisible}
          onClose={() => setPopupVisible(false)}>
          {/* 選択された oldTagInfo の詳細データをレンダリング */}
          {selectedOldTagInfo && renderDetailData(selectedOldTagInfo)}
        </PopupDetail>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default WA1066;
