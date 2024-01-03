/**-------------------------------------------
 * A01-0060_新タグID参照(土壌)
 * WA1064
 * screens/WA1064.tsx
 * ---------------------------------------------*/
import FunctionHeader from '../components/FunctionHeader.tsx'; // Headerコンポーネントのインポート
import Footer from '../components/Footer.tsx'; // Footerコンポーネントのインポート
import { styles } from '../styles/CommonStyle.tsx'; // 共通スタイル
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput} from 'react-native';
import { logUserAction, logScreen  } from '../utils/Log.tsx';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootList } from '../navigation/AppNavigator.tsx';
import { useRecoilState,useRecoilValue} from "recoil";
import { WA1061BackState,WA1060PrevScreenId,WA1060DataState,WA1060NewTagIdState,WA1060OldTagInfosState } from "../atom/atom.tsx";
import { useAlert } from '../components/AlertContext.tsx';
import messages from '../utils/messages.tsx';
import ProcessingModal from '../components/Modal.tsx';
import { getInstance } from '../utils/Realm.tsx'; // realm.jsから関数をインポート
// WA1064 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'WA1064'>;
interface Props {
  navigation: NavigationProp;
};
const WA1064 = ({navigation}:Props) => {
    const [newTagId,setNewTagId] = useRecoilState(WA1060NewTagIdState);//新タグID
    const WA1060OldTagInfos = useRecoilValue(WA1060OldTagInfosState);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [prevScreenId,setPrevScreenId] = useRecoilState(WA1060PrevScreenId);//遷移元画面ID
    const [WA1060Data,setWA1060Data] = useRecoilState(WA1060DataState);
    const [caLgSdBgWt,setCaLgSdBgWt] = useState<string>();
    const [caLgSdBgDsInt,setCaLgSdBgDsInt] = useState<string>();
    const [caLgSdBgDsDec,setCaLgSdBgDsDec] = useState<string>();
    const [back,setBack] = useRecoilState(WA1061BackState);
    const [estRa,setEstRa] = useState<string>('-');
    const realm = getInstance();
    const settings = realm.objects('settings')[0];
    const { showAlert } = useAlert();

    /************************************************
     * 初期表示設定
     ************************************************/   
    useEffect(() => {
      //初期値設定
      const init = async () => {
        //重量
        if(WA1060Data.caLgSdBgWt){
          setCaLgSdBgWt(WA1060Data.caLgSdBgWt);
        }
        //線量
        if(WA1060Data.caLgSdBgDs){
          const tmpCaLgSdBgDs = WA1060Data.caLgSdBgDs.split(".");
          setCaLgSdBgDsInt(tmpCaLgSdBgDs[0])
          if(tmpCaLgSdBgDs.length > 1){
            setCaLgSdBgDsInt(tmpCaLgSdBgDs[1])
          }
        }
        //推定放射能濃度
        if(caLgSdBgWt && caLgSdBgDsInt && caLgSdBgDsDec){
          await caLgSdBgDs();
        }
      }
      init();

    }, []);
    
    //値変更時再計算
    useEffect(() => {
      const calc = async () => {
        await caLgSdBgDs();
      }
      calc();
    }, [caLgSdBgWt,caLgSdBgDsInt,caLgSdBgDsDec]);

    //推定放射能濃度計算
    const caLgSdBgDs = async () => {
      if(!caLgSdBgWt || !caLgSdBgDsInt || !caLgSdBgDsDec){
        setEstRa('-');
      }else if(caLgSdBgWt=='0'){
        setEstRa('0');
      }else{
        //線量(μSv/h) ×換算値÷重量(Kg) を 四捨五入して整数にする
        const result = Math.round(
          Number(caLgSdBgWt) * Number(settings.radioConvFact) / (Number(caLgSdBgDsInt)+Number(caLgSdBgDsDec)))
        if(result > Number(settings.estRadioThres)){
          await showAlert("通知", messages.WA5006(String(settings.estRadioThres)), false);
        }
        setEstRa(String(result));
      }
    }

    /************************************************
     * 破棄ボタン処理
     ************************************************/
    const btnAppDestroy = async () => {
      await logUserAction(`ボタン押下: 破棄(WA1064)`);
      const result = await showAlert("確認", messages.IA5012(), true);
      if (result) {
        setBack(true);
        setPrevScreenId("WA1040")
        await logScreen(`画面遷移:WA1060_新タグ読込(土壌)`);
        navigation.navigate('WA1060');
      }
    };

    /************************************************
     * 戻るボタン処理
     ************************************************/
    const btnAppBack = async () => {
      await logUserAction(`ボタン押下: 戻る(WA1064)`);
      if(prevScreenId==='WA1066') {
        //遷移元画面IDを設定
        setPrevScreenId("WA1064");        
        await logScreen(`画面遷移:WA1066_登録内容確認(土壌)`);
        navigation.navigate("WA1066");
      }else{
        const result = await showAlert("確認", messages.IA5014(), true);
        if (result) {
          // 一時領域をクリアする
          setWA1060Data({...WA1060Data,
            caLgSdBgWt:'',//重量
            caLgSdBgDs:'',//線量
            estRa:'',//推定放射能濃度
          });
          //遷移元画面IDを設定
          setPrevScreenId("WA1064");          
          await logScreen(`画面遷移:WA1063_必須情報入力(土壌)`);
          navigation.navigate("WA1063");  
        }
      }
    };

    /************************************************
     * 次へボタン処理
     ************************************************/
    const btnAppNext = async () => {
      await logUserAction(`ボタン押下: 次へ(WA1064)`);
      //重量が閾値を越えるか確認
      if(Number(caLgSdBgWt) > Number(settings.kgThresSoil)){
        const result = await showAlert("確認", messages.WA5004(String(settings.kgThresSoil)), true);
        if(!result){
          return;
        }
      }
      //線量が閾値を越えるか確認
      if((Number(caLgSdBgDsInt)+Number(caLgSdBgDsDec)) > Number(settings.radioThres)){
        const result = await showAlert("確認", messages.WA5004(String(settings.radioThres)), true);
        if(!result){
          return;
        }
      }
      // 一時領域に設定する
      setWA1060Data({...WA1060Data,
        caLgSdBgWt:String(caLgSdBgWt ?? ''),//重量
        caLgSdBgDs:(caLgSdBgDsInt && caLgSdBgDsDec) ? String(Number(caLgSdBgDsInt)+Number(caLgSdBgDsDec)) : '',//線量
        estRa:String(estRa),//推定放射能濃度
      });
      if(prevScreenId==='WA1066') {
        //遷移元画面IDを設定
        setPrevScreenId("WA1064");
        await logScreen(`画面遷移:WA1066_登録内容確認(土壌)`);
        navigation.navigate("WA1066");
      }else{
        //遷移元画面IDを設定
        setPrevScreenId("WA1064");
        await logScreen(`画面遷移:WA1065_メモ入力(土壌)`);
        navigation.navigate("WA1065");
      }
    };

    return (
      <View style={styles.container}>
          {/* ヘッダ */}
          <FunctionHeader appType={"現"} viewTitle={"重量・線量"} functionTitle={"紐付(土)"}/>
      
          {/* 上段 */}
          <View  style={[styles.main,styles.topContent]}>
            <Text style={[styles.labelText]}>新タグID：{newTagId}</Text>
            <Text style={[styles.labelText]}>旧タグ数：{WA1060OldTagInfos.length}</Text>
            <Text style={[styles.labelText,styles.centerContent]}>重量、線量を入力して下さい。</Text>
            <View style={styles.middleContainer}>
              <View style={styles.tableMain}>
                <View style={[styles.tableRow,styles.pickerContainer]}>
                  <View style={styles.tableCell}><Text style={[styles.inputLabelText,styles.alignRight]}>重量(Kg)：</Text></View>
                  <View style={[styles.tableCell,styles.center,styles.decimalInputContainer]}>
                    <TextInput
                      keyboardType="numeric"
                      value={caLgSdBgWt}
                      style={styles.inputWt}
                      maxLength={4}
                      onChangeText={(text: string) => {
                          const filteredText = text.replace(/[^0-9]/g, '');
                          setCaLgSdBgWt(filteredText)
                        }
                      }
                    />                    
                  </View>
                </View>
                <View style={[styles.tableRow,styles.pickerContainer]}>
                  <View style={styles.tableCell}><Text style={[styles.inputLabelText,styles.alignRight]}>線量(μSv/h)：</Text></View>
                  <View style={[styles.tableCell,styles.center,styles.decimalInputContainer]}>
                    <TextInput 
                      keyboardType="numeric"
                      value={caLgSdBgDsInt}
                      style={styles.inputDs}
                      maxLength={4}
                      onChangeText={(text: string) => {
                          const filteredText = text.replace(/[^0-9]/g, '');
                          setCaLgSdBgDsInt(filteredText)
                        }                      
                      }
                    />
                    <Text style={styles.dotStyle}>.</Text>
                    <TextInput 
                      keyboardType="numeric"
                      value={caLgSdBgDsDec}
                      style={styles.inputDs}
                      maxLength={2}
                      onChangeText={(text: string) => {
                          const filteredText = text.replace(/[^0-9]/g, '');
                          setCaLgSdBgDsDec(filteredText)
                        }
                      }                      
                    />
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}><Text style={[styles.inputLabelText,styles.alignRight]}>推定放射能濃度：</Text></View>
                  <View style={styles.tableCell}><Text style={styles.inputLabelText}>{estRa}</Text></View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}><Text style={[styles.inputLabelText,styles.alignRight]}>(Bq/Kg)　</Text></View>
                  <View style={styles.tableCell}><Text style={styles.inputLabelText}></Text></View>
                </View>                
              </View>
            </View>
          </View>
     

          {/* 下段 */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={[styles.button, styles.destroyButton]} onPress={btnAppDestroy}>
              <Text style={styles.endButtonText}>破棄</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={[styles.button, styles.endButton]} onPress={btnAppBack}>
              <Text style={styles.endButtonText}>戻る</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.button,styles.startButton]}
                onPress={btnAppNext}
            >
              <Text style={styles.startButtonText}>次へ</Text>
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
export default WA1064;