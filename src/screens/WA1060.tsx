/**-------------------------------------------
 * A01-0060_新タグID参照(土壌)
 * WA1060
 * screens/WA1060.tsx
 * ---------------------------------------------*/
import FunctionHeader from '../components/FunctionHeader.tsx'; // Headerコンポーネントのインポート
import Footer from '../components/Footer.tsx'; // Footerコンポーネントのインポート
import { styles } from '../styles/CommonStyle.tsx'; // 共通スタイル
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback ,ScrollView,KeyboardAvoidingView } from 'react-native';
import { getInstance } from '../utils/Realm.tsx'; // realm.jsから関数をインポート
import messages from '../utils/messages.tsx';
import QRScanner from '../utils/QRScanner.tsx';
import ProcessingModal from '../components/Modal.tsx';
import { logUserAction, logScreen  } from '../utils/Log.tsx';
import { useAlert } from '../components/AlertContext.tsx';
import { IFA0330 } from '../utils/Api.tsx'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RNCamera } from 'react-native-camera';
import { RootList } from '../navigation/AppNavigator';
import { ApiResponse, IFA0110Response,IFA0330ResponseDtl } from '../types/type.tsx';
import { useSetRecoilState, useRecoilState, useRecoilValue, useResetRecoilState  } from "recoil";
import { WA1060PrevScreenId,WA1060DataState,WA1061BackState,WA1060CmnTagFlgState,WA1060NewTagIdState,WA1060OldTagInfosState,WA1060WkPlacState,WA1063MemoAutoState,WA1065MemoState } from "../atom/atom.tsx";
import { CT0007} from "../enum/enums.tsx";

// WA1060 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'WA1060'>;
interface Props {
  navigation: NavigationProp;
};
const WA1060 = ({navigation}:Props) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [showScannerTag, setShowScannerTag] = useState<boolean>(false); // カメラ表示用の状態    
    const [wkplcTyp, setWkplcTyp] = useState<string>('');
    const [wkplc, setWkplc] = useState<string>('');
    const setWA1060Data = useSetRecoilState(WA1060DataState);//・
    const WA1060Data = useRecoilValue(WA1060DataState);//・
    const [inputVisible, setInputVisible] = useState<boolean>(false);
    const [isNext, setIsNext] = useState<boolean>(false); // 送信準備完了状態
    const [inputValue, setInputValue] = useState<string>('');
    const [isViewNextButton, setIsViewNextButton] = useState<boolean>(false);
    const [isCannotRead, setIsCannotRead] = useState<boolean>(false);
    const [back,setBack] = useRecoilState(WA1061BackState);
    const [cmnTagFlg,setCmnTagFlg] = useRecoilState(WA1060CmnTagFlgState);   
    const [newTagId,setNewTagId] = useRecoilState(WA1060NewTagIdState);
    const [WA1060oldTagInfos,setWA1060OldTagInfos] = useRecoilState(WA1060OldTagInfosState);
    const [prevScreenId,setPrevScreenId] = useRecoilState(WA1060PrevScreenId);//遷移元画面ID
    const [showScannerWkPlc, setShowScannerWkPlc] = useState<boolean>(false); // カメラ表示用の状態
    const [idTyp,setIdTyp] = useState<string>();
    const [WA1060WkPlac,setWA1060WkPlac] = useRecoilState(WA1060WkPlacState);
    const [delSrcTyp,setDelSrcTyp] = useState<number|null>();
    const [isTagRead, setIsTagRead] = useState<boolean>(false); // 送信準備完了状態
    const [isWkPlcRead, setIsWkPlcRead] = useState<boolean>(false); // タグ読込
    const resetWA1060Data = useResetRecoilState(WA1060DataState);
    const resetWA1060NewTagId = useResetRecoilState(WA1060NewTagIdState);
    const resetWA1060CmnTagFlg = useResetRecoilState(WA1060CmnTagFlgState);
    const resetWA1060OldTagInfos = useResetRecoilState(WA1060OldTagInfosState);
    const resetWA1060WkPlac = useResetRecoilState(WA1060WkPlacState);
    const resetWA1063MemoAuto = useResetRecoilState(WA1063MemoAutoState);
    const resetWA1065Memo = useResetRecoilState(WA1065MemoState);
    const { showAlert } = useAlert();
    /************************************************
     * 初期表示設定
     ************************************************/
    //初期処理
    useEffect(() => {
      if(prevScreenId && prevScreenId==='WA1040'){
        reset();
      }
      setPrevScreenId("WA1060");
      contentsViews();
    }, []);

    useEffect(() => {
      if(prevScreenId && prevScreenId==='WA1040'){
        reset();
      }
      setPrevScreenId("WA1060");
      setBack(false);
      contentsViews();
    }, [back]);    

    const contentsViews = async () => {
      const realm = getInstance();
      const loginInfo = realm.objects('login')[0];
      let place;
      switch(loginInfo.wkplacTyp){
        case 4:
          setIdTyp(String(loginInfo.wkplacTyp));
          place = realm.objects('temporary_places')[0]
          setWkplcTyp("仮置場");    
          setWA1060WkPlac({
            idTyp:'4',//ID種別
            wkplacId:place.tmpPlacId as string,//作業場所ID
            wkplacNm:place.tmpPlacNm as string,//作業場所名
            delSrcTyp:place.delSrcTyp as string,//搬出元種別
            wkplac:wkplcTyp,//作業場所
          });
          setWkplc(place.tmpPlacNm as string);
          setDelSrcTyp(place.delSrcTyp as number);
          setIsTagRead(true);
          break;
        case 5:
        case 6:
          setIsTagRead(false);
          await showAlert("通知", messages.WA5001(), false);
          break;
      }
    }     
    // 値の初期化
    const reset = () =>{
      resetWA1060Data();
      resetWA1060OldTagInfos();
      resetWA1060CmnTagFlg();
      resetWA1060NewTagId();
      resetWA1060WkPlac();
      resetWA1063MemoAuto();
      resetWA1065Memo();

      setIsTagRead(false);      
      setIsWkPlcRead(false);      
      setPrevScreenId("WA1060");
      setIsCannotRead(false);
      setInputVisible(false);
      setInputValue(""); 
      setIsViewNextButton(false);
      setIdTyp("");
      setDelSrcTyp(null);
      setWkplc("");
      setWkplcTyp("");
      contentsViews()
    };
    // 10秒以上の長押しを検出
    const handleLongPress = () => {  
      setTimeout(() => {
        setInputVisible(true);
        setIsNext(false);
        setIsCannotRead(true);
        setIsViewNextButton(true);
      }, 10000); // 10秒 = 10000ミリ秒
    };
    // 次へボタンのスタイルを動的に変更するための関数
    const getNextButtonStyle = () => {
      return isNext ? [styles.button,styles.startButton] : [styles.button,styles.startButton, styles.disabledButton];
    }
    // タグ読込ボタンのスタイルを動的に変更するための関数
    const getTagReadButtonStyle = () =>{
      return isTagRead ? [styles.button,styles.buttonSmall,styles.centerButton] : [styles.button,styles.buttonSmall,styles.centerButton,styles.disabledButton];
    }    
    // テキストボックスのスタイルを動的に変更するための関数
    const getTextInputStyle = () =>{
      return isWkPlcRead ? styles.input : [styles.input,styles.inputDisabled];
    }    
    // 新タグID読み取りメッセージ
    const getInfoMsg = () =>{
      return isCannotRead ? "新タグIDが読み込めない場合：" : "新タグIDが読み込めない場合はここを長押しして下さい。";
    } 
    // 入力値が変更されたときのハンドラー
    const handleInputChange = (text:string) => {
      setInputValue(text); 
    };
    // 入力がフォーカスアウトされたときのハンドラー
    const handleInputBlur = async () => {
      // 入力値が空かどうかによってブール値ステートを更新
      setIsNext(inputValue !== '');
      // 正規表現チェック
      if(!checkFormat(inputValue)){
        await showAlert("通知", messages.EA5017(inputValue), false);
        setIsNext(false);
        return 
      }
      // 一桁目チェック
      if (inputValue.startsWith('6') || inputValue.startsWith('8')) {
        await showAlert("通知", messages.EA5022("土壌","新タグ参照(灰)",inputValue), false);
        setIsNext(false);
        return 
      }
    };
    
    /************************************************
     * コードスキャン後の処理 (作業場所用)
     * @param param0 
     * @returns 
     ************************************************/
    const handleCodeScannedForWkPlc = async (data:string) => {
      const parts = data.split(',');
      setShowScannerWkPlc(false);
      if(parts[0]!=="4"){
        await showAlert("通知", messages.EA5007(), false);
        return;
      }
      setWkplcTyp("仮置場");
      setIdTyp(parts[0]);
      setWA1060WkPlac({
        idTyp:parts[0],//ID種別
        wkplacId:parts[1],//作業場所ID
        wkplacNm:parts[2],//作業場所名
        delSrcTyp:parts[3],//搬出元種別
        wkplac:wkplcTyp,
      });      
      setWkplc(parts[2]);
      setDelSrcTyp(Number(parts[3]));

      setIsTagRead(true);
      setIsWkPlcRead(true);
    };
    // 作業場所Rコードスキャンボタン押下時の処理
    const btnWkPlcQr = async () => {
      await logUserAction(`ボタン押下: 作業場所読込`);
      setShowScannerWkPlc(true);
    }; 

    /************************************************
     * フォーマットチェック
     ************************************************/
    const checkFormat = (data:string) => {
      const pattern = /^[0-9][2-5][0-9]0[0-9]{11}$/;
      return pattern.test(data);
    };

    /************************************************
     * コードスキャン後の処理 (タグ用)
     * @param param0 
     * @returns 
     ************************************************/
    const handleCodeScannedForTag = async (data:string,type:string) => {
      const parts = data.split(',');
      setShowScannerTag(false);
      let code = '';
      if (type !== RNCamera.Constants.BarCodeType.qr && type !== 'CODABAR') {
        await showAlert("通知", messages.EA5008(), false);
        return;
      }else if(type === RNCamera.Constants.BarCodeType.qr && (parts.length === 1 || parts[0] !== "CM" )){
        await showAlert("通知", messages.EA5009(), false);
        return;
      }else if(type === RNCamera.Constants.BarCodeType.qr && (parts[0] === "CM")){
        // --QRコード--
        // 新タグID参照処理実施(csvデータ2カラム目 新タグID)
        // モーダル表示
        setModalVisible(true);        
        code = parts[1];
      }else if(type === 'CODABAR'){
        // --バーコード--
        // フォーマットチェック
        if(!checkFormat(data)){
          await showAlert("通知", messages.EA5017(data), false);
          return;
        }
        // モーダル表示
        setModalVisible(true);        
        code = "a"+data+"a"
      }else{
        //イレギュラー
        //・CMから始まるバーコードもしくは
        //・1カラム目は非CMの複数カラムデータ
        await showAlert("通知", messages.EA5008(), false);
        return;
      }

      // 新タグID参照処理実施(QR・バーコード)
      const retScreen = await procBarCode(code);
      if(retScreen==='WA1066') {
        // QR・バーコード両方
        setModalVisible(false);
        await logScreen(`画面遷移:WA1066_登録内容確認(土壌)`);
        navigation.navigate("WA1066");
      }else if(type !== RNCamera.Constants.BarCodeType.qr && retScreen==='WA1063') {
        // バーコードのみ 画面遷移
        setModalVisible(false);
        await logScreen(`画面遷移:WA1063_必須情報設定(土壌)`);
        navigation.navigate("WA1066");
      }else if(type !== RNCamera.Constants.BarCodeType.qr && retScreen==='WA1061') {
        // バーコードのみ 画面遷移
        setModalVisible(false);
        await logScreen(`画面遷移:WA1061_旧タグ読込(土壌)`);
        navigation.navigate("WA1061");
      }else if(type !== RNCamera.Constants.BarCodeType.qr){
        // バーコードのみ 終了処理
        // モーダル非表示
        setModalVisible(false);        
        setShowScannerTag(false);
      }        

      //以降QRのみ
      setCmnTagFlg('1');//共通タグフラグ 1（共通タグ）
      setNewTagId(code);
      // 新タグ情報を一時領域に格納
      setWA1060Data({
        tyRegDt:parts[15]+" 09:00:00",//紐付登録日時
        caLgSdBgWt:parts[16],//重量
        caLgSdBgDs:parts[17],//線量
        rmSolTyp:parts[8],//除去土壌等種別
        pkTyp:parts[10],//荷姿種別
        usgInnBg:parts[11],//内袋の利用方法
        tsuInd:parts[6],//津波浸水域由来
        splFac:parts[7],//特定施設由来
        usgAluBg:parts[7],//アルミ内袋の有無
        yesNoOP:'0',//オーバーパック有無
        estRa:'-',//推定放射能濃度
      });

      //7カラム目の津波浸水が1の場合
      if(parts[6]==="1"){
        const result = await showAlert("確認", messages.IA5007("津波浸水"), true);
        if (!result) {
          return
        }
      }
      let setRmSolInf = true;
      //8カラム目の特定施設由来が1の場合
      if(parts[7]==="1"){
        const result = await showAlert("確認", messages.IA5007("特定施設由来"), true);
        if (!result) {
          return
        }else{
          const result = await showAlert("確認", messages.IA5019(), true);
          if (!result) {
            return
          }else{
            setWA1060Data((prevWA1060Data) => ({
             ...prevWA1060Data,
              splFac:"2",//特定施設由来
            }));
            setRmSolInf = false
          }
        }
      }
      //[旧タグ由来情報(配列)]の0番目に保存
      setWA1060OldTagInfos([{
          //[旧タグ由来情報(配列)]
          oldTag:parts[2],//旧タグID
          genbaCheck:'1',//現場確認
          tsuInd:WA1060Data.tsuInd,//津波浸水
          splFac:WA1060Data.splFac,//特定施設由来
          rmSolTyp:WA1060Data.rmSolTyp,//去土壌等種別
          ocLndCla:parts[9],//発生土地分類
          pkTyp:WA1060Data.pkTyp,//荷姿種別
          usgInnBg:WA1060Data.usgInnBg,//内袋の利用方法
          usgInnBgNm:CT0007[Number(parts[11])],//内袋の利用方法名
          usgAluBg:WA1060Data.usgAluBg,//アルミ内袋の有無
          vol:parts[13],//容積
          airDsRt:parts[14],//空間線量率
          ocLndUseknd:"",//発生土地の利用区分
          ocloc:parts[5],//発生場所
          rmSolInf:(setRmSolInf) ? parts[18] : "調査結果：汚染の恐れなし",//備考(除去土壌情報) 
          lnkNewTagDatMem:"",//除染時データメモ
          }]);

      // モーダル非表示
      setModalVisible(false);
      await logScreen(`画面遷移:WA1065_メモ入力(土壌)`);  
      navigation.navigate('WA1065')
    }
    // タグコードスキャンボタン押下時の処理
    const btnTagQr = async () => {
      await logUserAction(`ボタン押下: タグ読込`);
      setShowScannerTag(true);
    }; 

    /************************************************
     * 新タグID参照処理
     ************************************************/
    const procBarCode = async (txtNewTagId:string):Promise<string> => {
      // 通信を実施
      const responseIFA0330 = await IFA0330(txtNewTagId);
      if(await apiIsError(responseIFA0330)) {
        return ""
      }
      const data = responseIFA0330.data as IFA0110Response<IFA0330ResponseDtl>;
      //レスポンス1件(共通)
      if(data.dtl.length===1){
        const result = await showAlert("確認", messages.IA5017(), true);
        if (result) {
          return "WA1066"
        }else{
          return ""
        }
      }else{
        setCmnTagFlg('2');//共通タグフラグ 2（新タグ）
        setNewTagId(txtNewTagId);
        if(delSrcTyp===1){
          return "WA1063"
        }else{
          return "WA1061"
        }
      }    
    }

    /************************************************
     * 破棄ボタン処理
     ************************************************/
    const btnAppDestroy = async () => {
      await logUserAction(`ボタン押下: 破棄(WA1060)`);
      const result = await showAlert("確認", messages.IA5012(), true);
      if (result) {
        reset();
        setPrevScreenId("WA1040")
        setBack(true);
        await logScreen(`画面遷移:WA1060_新タグ読込(土壌)`);
        navigation.navigate('WA1060');
      }
    };
    
    /************************************************
     * 戻るボタン処理
     ************************************************/
    const btnAppBack = async () => {
      await logUserAction(`ボタン押下: 戻る(WA1060)`);
      const result = await showAlert("確認", messages.IA5011(), true);
      if (result) {
        await logScreen(`画面遷移:WA1040_メニュー`);  
        navigation.navigate('WA1040');
      }
    };

    /************************************************
     * 次へボタン処理
     ************************************************/
    const btnAppNext = async () => {
      await logUserAction(`ボタン押下: 次へ(WA1060)`);  
      // モーダル表示
      setModalVisible(true);
      // 新タグID参照処理実施
      const retScreen = await procBarCode('a' + inputValue + 'a');
      if(retScreen==='WA1066') {
        setModalVisible(false);
        await logScreen(`画面遷移:WA1066_登録内容確認(土壌)`);
        navigation.navigate("WA1066");
      }else if(retScreen==='WA1063') {
        setModalVisible(false);
        await logScreen(`画面遷移:WA1063_必須情報設定(土壌)`);
        navigation.navigate("WA1063");
      }else if(retScreen==='WA1061') {
        setModalVisible(false);
        await logScreen(`画面遷移:WA1061_旧タグ読込(土壌)`);
        navigation.navigate("WA1061");
      }else{
        // モーダル非表示
        setModalVisible(false);
        setShowScannerTag(false);
      }
    };

    /************************************************
     * API通信処理エラー有無確認・エラーハンドリング
     * @param {*} response 
     * @returns 
     ************************************************/
    const apiIsError = async <T,>(response:ApiResponse<T>):Promise<boolean>=>{
      if (!response.success) {
        switch(response.error){
          case 'codeHttp200':
            await showAlert("通知", messages.EA5004(response.api as string,response.code as string), false);
            break;
          case 'codeRsps01':
            await showAlert("通知", messages.EA5005(response.api as string,response.status as number), false); 
            break;
          case 'timeout':
            await showAlert("通知", messages.EA5003(), false);
            break;
          case 'zero'://取得件数0件の場合
            await showAlert("通知", messages.IA5015(), false);
            break;                  
        }
        return true ;
      }else{
        return false;
      }
    }

    return (

      <KeyboardAvoidingView 
        behavior={"padding"}
        style={{ flex: 1 }} // KeyboardAvoidingView に flex: 1 を追加
        keyboardVerticalOffset={0}
      >
        <ScrollView  contentContainerStyle={[styles.containerWithKeybord, { flexGrow: 1 }]}>
          {/* ヘッダ */}
          <FunctionHeader appType={"現"} viewTitle={"新タグ読込"} functionTitle={"紐付(土)"}/>
    
          {/* 上段 */}
          <View  style={[styles.main]}>
            <Text style={[styles.labelText]}>作業場所：{wkplcTyp}</Text>
            <Text style={[styles.labelText,styles.labelTextPlace]}>{wkplc}</Text>
            <TouchableOpacity style={[styles.button,styles.buttonSmall,styles.centerButton]} onPress={btnWkPlcQr}>
              <Text style={styles.buttonText}>作業場所読込</Text>
            </TouchableOpacity>            
          </View>

          {/* 中段1 */}
          <View  style={[styles.main]}>
            <Text style={styles.labelText}>下記ボタンを押してフレコンに取り付けられたタグを読み込んで下さい。</Text>
            <TouchableOpacity style={getTagReadButtonStyle()} onPress={btnTagQr}>
              <Text style={styles.buttonText}>タグ読込</Text>
            </TouchableOpacity>          
          </View>

          {/* 中段2 */}
          <View  style={[styles.main,styles.center]}>
            <TouchableWithoutFeedback onLongPress={handleLongPress}>
              <Text style={styles.labelText}>{getInfoMsg()}</Text>
            </TouchableWithoutFeedback>
            {inputVisible && 
              <View style={[styles.inputContainer]}>
                <Text style={styles.inputWithText}>a</Text>
                <TextInput 
                  style={getTextInputStyle()}
                  onChangeText={handleInputChange}
                  onBlur={handleInputBlur}
                  value={inputValue}
                  editable={isWkPlcRead}
                  maxLength={15}
                />
                <Text style={styles.inputWithText}>a</Text>
              </View>
            }
          </View>
          <View style={{ flex: 1 }} /> 
          {/* 下段 */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={[styles.button, styles.destroyButton]} onPress={btnAppDestroy}>
              <Text style={styles.endButtonText}>破棄</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={[styles.button, styles.endButton]} onPress={btnAppBack}>
              <Text style={styles.endButtonText}>戻る</Text>
            </TouchableOpacity>
            {isViewNextButton && 
              <TouchableOpacity 
                  style={getNextButtonStyle()}
                  onPress={btnAppNext}
                  disabled={!isNext}
              >
                <Text style={styles.startButtonText}>次へ</Text>
              </TouchableOpacity>  
            }         
          </View>
        
          {/* フッタ */}
          <Footer />

          {/* 処理中モーダル */}
          <ProcessingModal
            visible={modalVisible}
            message={messages.IA5018()}
            onClose={() => setModalVisible(false)}
          />

          {/* 作業場所用QRコードスキャナー */}
          {showScannerWkPlc && (
              <Modal visible={showScannerWkPlc} onRequestClose={() => setShowScannerWkPlc(false)}>
                  <QRScanner onScan={handleCodeScannedForWkPlc} closeModal={() => setShowScannerWkPlc(false)} isActive={showScannerWkPlc} errMsg={"作業場所QRコード"}/>
              </Modal>
          )}

          {/* タグ用QRコードスキャナー */}
          {showScannerTag && (
              <Modal visible={showScannerTag} onRequestClose={() => setShowScannerTag(false)}>
                  <QRScanner onScan={handleCodeScannedForTag} closeModal={() => setShowScannerTag(false)} isActive={showScannerTag} errMsg={"タグ"}/>
              </Modal>
          )}

        </ScrollView>
      </KeyboardAvoidingView>  
    );
    
};
export default WA1060;