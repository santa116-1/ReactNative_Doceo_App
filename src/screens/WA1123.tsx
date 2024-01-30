/**-------------------------------------------
 * A01-0120_輸送カード申請
 * WA1123
 * screens/WA1123.tsx
 * ---------------------------------------------*/
import FunctionHeader from '../components/FunctionHeader.tsx'; // Headerコンポーネントのインポート
import Footer from '../components/Footer.tsx'; // Footerコンポーネントのインポート
import {styles} from '../styles/CommonStyle.tsx'; // 共通スタイル
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {logUserAction, logScreen} from '../utils/Log.tsx';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootList} from '../navigation/AppNavigator.tsx';
import {useSetRecoilState, useRecoilValue} from 'recoil';
import {
  WA1120DataState,
  WA1120PrevScreenId,
  WA1120CarState,
  WA1120DrvState,
  WA1120DestState,
  WA1120TrpCardNoState,
  WA1121DataState,
} from '../atom/atom.tsx';
import {useAlert} from '../components/AlertContext.tsx';
import messages from '../utils/messages.tsx';
import ProcessingModal from '../components/Modal.tsx';
import {getInstance} from '../utils/Realm.tsx'; // realm.jsから関数をインポート
import {IFT0210} from '../utils/Api.tsx';
import {ApiResponse, IFT0210Response, IFT0210ResponseDtl} from '../types/type';
import QRCode from 'react-native-qrcode-svg';

// WA1123 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'WA1123'>;
interface Props {
  navigation: NavigationProp;
}
const WA1123 = ({navigation}: Props) => {
  const setPrevScreenId = useSetRecoilState(WA1120PrevScreenId); //遷移元画面ID
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const WA1120Car = useRecoilValue(WA1120CarState);
  const WA1120Drv = useRecoilValue(WA1120DrvState);
  const WA1120Dest = useRecoilValue(WA1120DestState);
  const WA1120Data = useRecoilValue(WA1120DataState);
  const WA1121Data = useRecoilValue(WA1121DataState);
  const WA1120TrpCardNo = useRecoilValue(WA1120TrpCardNoState);
  const [isViewUpdate, setIsViewUpdate] = useState<boolean>(true);
  const [makeQR, doMakeQR] = useState<boolean>(false);
  const realm = getInstance();
  const loginInfo = realm.objects('login')[0];
  const {showAlert} = useAlert();

  /************************************************
   * 初期表示設定
   ************************************************/
  useEffect(() => {
    if (WA1121Data.trpCardApRslt === '0') {
      setIsViewUpdate(false);
      doMakeQR(true);
    }
  }, []);

  // CSVデータの生成
  const csvData = () => {
    return `${loginInfo.comId},${WA1120TrpCardNo}`;
  };

  /************************************************
   * 更新ボタン処理
   ************************************************/
  const btnUpdate = async () => {
    await logUserAction('ボタン押下: 更新(WA1123)');

    setModalVisible(true);
    //通信処理 IFT0210 輸送カード承認状況
    const responseIFT0210 = await IFT0210(WA1120TrpCardNo);
    setModalVisible(false);
    if (await apiIsError(responseIFT0210)) {
      return;
    }
    setModalVisible(false);
    const data = responseIFT0210.data as IFT0210Response<IFT0210ResponseDtl>;
    const dataDtl = data.dtl[0] as IFT0210ResponseDtl;
    if (dataDtl.crdIsRlt === 1) {
      await showAlert('通知', messages.IA5023(), false);
      await logScreen('画面遷移:WA1121_輸送カード申請新タグ読込');
      navigation.navigate('WA1121');
    } else {
      setIsViewUpdate(false);
      doMakeQR(true);
    }
  };

  /************************************************
   * 輸送カード申請ボタン処理
   ************************************************/
  const btnReqTrpCrd = async () => {
    await logUserAction('ボタン押下: 輸送カード申請(WA1123)');

    const result = await showAlert('確認', messages.IA5022(), true);
    if (result) {
      setPrevScreenId('WA1040');
      await logScreen('画面遷移:WA1120_輸送カード申請QRコード読込');
      navigation.navigate('WA1120');
    }
  };

  /************************************************
   * API通信処理エラー有無確認・エラーハンドリング
   * @param {*} response
   * @returns
   ************************************************/
  const apiIsError = async <T,>(response: ApiResponse<T>): Promise<string> => {
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
          return 'zero';
      }
      return 'error';
    } else {
      return '';
    }
  };

  return (
    <View style={styles.container}>
      {/* ヘッダ */}
      <FunctionHeader
        appType={'現'}
        viewTitle={'申請結果表示'}
        functionTitle={'輸送(申)'}
      />

      {/* 上段 */}
      <View style={[styles.main]}>
        <Text style={[styles.labelText]}>作業場所：{WA1120Data.wkplcTyp}</Text>
        <Text style={[styles.labelTextNarrow, styles.labelTextPlace]}>
          {WA1120Data.wkplc}
        </Text>
      </View>

      {/* 中段1 */}
      <View style={[styles.textareaContainer, styles.topContent]}>
        <View style={styles.tableMain}>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={[styles.labelTextNarrow, styles.alignRight]}>
                輸送車両：
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.labelTextNarrow}>{WA1120Car.carNo}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={[styles.labelTextNarrow, styles.alignRight]}>
                運転手：
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.labelTextNarrow}>{WA1120Drv.drvNm}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={[styles.labelTextNarrow, styles.alignRight]}>
                行先名：
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.labelTextNarrow}>{WA1120Dest.fixPlacNm}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={[styles.labelTextNarrow, styles.alignRight]}>
                輸送カード番号：
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.labelTextNarrow}>{WA1120TrpCardNo}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.textareaContainer, styles.topContent]}>
          <View style={styles.tableMain}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.labelTextNarrow, styles.alignRight]}>
                  申請状況：
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.labelTextNarrow}>{}</Text>
              </View>
            </View>
          </View>
          {isViewUpdate && (
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={[styles.button, styles.button50, styles.startButton]}
                onPress={btnUpdate}>
                <Text style={styles.startButtonText}>更新</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* QRコード */}
          {makeQR && (
            <View style={[styles.center, styles.updownMargin, styles.upMargin]}>
              <QRCode value={csvData()} />
            </View>
          )}
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.button, styles.button50, styles.startButton]}
          onPress={btnReqTrpCrd}>
          <Text style={styles.startButtonText}>輸送カード申請</Text>
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
    </View>
  );
};
export default WA1123;