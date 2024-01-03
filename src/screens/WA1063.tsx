/**-------------------------------------------
 * A01-0060_新タグID参照(土壌)
 * WA1063
 * screens/WA1063.tsx
 * ---------------------------------------------*/
import FunctionHeader from '../components/FunctionHeader.tsx'; // Headerコンポーネントのインポート
import Footer from '../components/Footer.tsx'; // Footerコンポーネントのインポート
import { styles } from '../styles/CommonStyle.tsx'; // 共通スタイル
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { logUserAction, logScreen  } from '../utils/Log.tsx';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootList } from '../navigation/AppNavigator.tsx';
import { useRecoilState,useRecoilValue} from "recoil";
import { WA1061BackState,WA1060PrevScreenId,WA1060DataState,WA1060NewTagIdState,WA1060OldTagInfosState } from "../atom/atom.tsx";
import { useAlert } from '../components/AlertContext.tsx';
import messages from '../utils/messages.tsx';
import ProcessingModal from '../components/Modal.tsx';
import { Picker } from '@react-native-picker/picker';
import { getInstance } from '../utils/Realm.tsx'; // realm.jsから関数をインポート
import { NativeModules } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
const { JISInputFilter } = NativeModules;
// WA1063 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'WA1063'>;
interface Props {
  navigation: NavigationProp;
};
const WA1063 = ({navigation}:Props) => {
    const [newTagId,setNewTagId] = useRecoilState(WA1060NewTagIdState);//新タグID
    const WA1060OldTagInfos = useRecoilValue(WA1060OldTagInfosState);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectRmSolType,setSelectRmSolType] = useState<string>('');
    const [selectUsgAluBg,setSelectUsgAluBg] = useState<string>('');
    const [selectTsuInd,setSelectTsuInd] = useState<string>('');
    const [selectSplFac,setSelectSplFac] = useState<string>('');
    const [selectUsgInnBg,setSelectUsgInnBg] = useState<string>('');
    const [selectPkTyp,setSelectPkTyp] = useState<string>('');
    const [checkYesNoOP,setCheckYesNoOP] = useState<boolean>(false);
    const [prevScreenId,setPrevScreenId] = useRecoilState(WA1060PrevScreenId);//遷移元画面ID
    const [WA1060Data,setWA1060Data] = useRecoilState(WA1060DataState);
    const [isCheckable,setIsCheckable] = useState<boolean>(false);
    const [back,setBack] = useRecoilState(WA1061BackState);
    const { showAlert } = useAlert();

    /************************************************
     * 初期表示設定
     ************************************************/   
    useEffect(() => {
  
      //PICKER初期値設定
      const realm = getInstance();
      const settings = realm.objects('settings')[0];
      setSelectPkTyp(String(settings.packTyp))
      setSelectUsgInnBg(String(settings.useMethodInnerBag))
      setSelectTsuInd('')
      setSelectSplFac('')
      setSelectUsgAluBg("2")
      const color = newTagId.substring(1).charAt(0);
      switch (color) {
        case '1':
          setSelectRmSolType('1');
          break;
        case '3':
          setSelectRmSolType('3');
          break;
        default:
          setSelectRmSolType("");
      }
      //一時記憶領域に設定がある場合表示
      if(WA1060Data.rmSolTyp) setSelectRmSolType(WA1060Data.rmSolTyp);
      if(WA1060Data.pkTyp) setSelectPkTyp(WA1060Data.pkTyp);
      if(WA1060Data.usgInnBg) setSelectUsgInnBg(WA1060Data.usgInnBg);
      if(WA1060Data.tsuInd) setSelectTsuInd(WA1060Data.tsuInd);
      if(WA1060Data.splFac) setSelectSplFac(WA1060Data.splFac);
      if(WA1060Data.usgAluBg) setSelectUsgAluBg(WA1060Data.usgAluBg);
      if(WA1060Data.yesNoOP) setCheckYesNoOP((WA1060Data.yesNoOP==='1'));
      //オーバーパック有無のチェック状態を決定
      if(WA1060Data.yesNoOP && WA1060OldTagInfos.length>1){
        setIsCheckable(true)
      }else if(!WA1060Data.yesNoOP && WA1060OldTagInfos.length>1){
        setCheckYesNoOP(false);
        setIsCheckable(true);
      }else{
        setIsCheckable(false);
      }
    }, []);

    useEffect(() => {

    }, []);


    /************************************************
     * 破棄ボタン処理
     ************************************************/
    const btnAppDestroy = async () => {
      await logUserAction(`ボタン押下: 破棄(WA1063)`);
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
      await logUserAction(`ボタン押下: 戻る(WA1063)`);
      if(prevScreenId==='WA1066') {
        //遷移元画面IDを設定
        setPrevScreenId("WA1063");
        await logScreen(`画面遷移:WA1066_登録内容確認(土壌)`);
        navigation.navigate("WA1066");
      }else{
        const result = await showAlert("確認", messages.IA5014(), true);
        if (result) {
          // 一時領域をクリアする
          setWA1060Data({...WA1060Data,
            rmSolTyp:'',//除去土壌等種別
            pkTyp:'',//荷姿種別
            usgInnBg:'',//内袋の利用方法
            tsuInd:'',//津波浸水域由来
            splFac:'',//特定施設由来
            usgAluBg:'',//アルミ内袋の有無
            yesNoOP:'',//オーバーパック有無
          });
          //遷移元画面IDを設定
          setPrevScreenId("WA1063");
          await logScreen(`画面遷移:WA1061_旧タグ読込(土壌)`);
          navigation.navigate("WA1061");  
        }
      }
    };

    /************************************************
     * 次へボタン処理
     ************************************************/
    const btnAppNext = async () => {
      await logUserAction(`ボタン押下: 次へ(WA1063)`);
      // 一時領域に設定する
      setWA1060Data({...WA1060Data,
        rmSolTyp:selectRmSolType,//除去土壌等種別
        pkTyp:selectPkTyp,//荷姿種別
        usgInnBg:selectUsgInnBg,//内袋の利用方法
        tsuInd:selectTsuInd,//津波浸水域由来
        splFac:selectSplFac,//特定施設由来
        usgAluBg:selectUsgAluBg,//アルミ内袋の有無
        yesNoOP:((checkYesNoOP) ? '1' : '0'),//オーバーパック有無
      });
      if(prevScreenId==='WA1066') {
        //遷移元画面IDを設定
        setPrevScreenId("WA1063");
        await logScreen(`画面遷移:WA1066_登録内容確認(土壌)`);
        navigation.navigate("WA1066");
      }else{
        //遷移元画面IDを設定
        setPrevScreenId("WA1063");
        await logScreen(`画面遷移:WA1064_重量・線量(土壌)`);
        navigation.navigate("WA1064");
      }
    };
    /************************************************
     * コンボボックス作成
     ************************************************/
    //除去土壌等種別
    const makePickerRmSolTyp = () => {
      const makeList = () =>{
        const color =newTagId.substring(1).charAt(0);
        let items = [<Picker.Item key="" label="未選択" value="" />]; // Picker.Item を格納する配列
        //タグ色に応じた旧タグ由来情報の除去土壌等種別判定
        switch(color){
          case '1'://緑色
            items.push(<Picker.Item key="1" label="1:草木類" value="1" />);
            break;
          case '2'://黄色
            items.push(<Picker.Item key="2" label="2:1以外の可燃廃棄物" value="2" />);
            items.push(<Picker.Item key="10" label="10:屋外残置廃棄物_可燃物" value="10" />);
            items.push(<Picker.Item key="12" label="12:仮置場解体発生可燃物" value="12" />);
            break;
          case '3'://白色
            items.push(<Picker.Item key="3" label="3:土壌等" value="3" />);
            break;
          case '4'://青色
            items.push(<Picker.Item key="4" label="4:コンクリート殻等" value="4" />);
            items.push(<Picker.Item key="5" label="5:アスファルト混合物" value="5" />);
            items.push(<Picker.Item key="6" label="6:3、4、5以外の混合物・不燃物" value="6" />);
            items.push(<Picker.Item key="11" label="11:屋外残置廃棄物_不燃物" value="11" />);
            items.push(<Picker.Item key="13" label="13:仮置場解体発生不燃物" value="13" />);
            break;
          case '5'://赤色
            items.push(<Picker.Item key="7" label="7:石綿含有建材" value="7" />);
            items.push(<Picker.Item key="8" label="8:石膏ボード" value="8" />);
            items.push(<Picker.Item key="9" label="9:7、8以外の危険物・有害物" value="9" />);
            break;
          case '7'://橙色
            items.push(<Picker.Item key="1" label="1:草木類" value="1" />);
            items.push(<Picker.Item key="2" label="2:1以外の可燃廃棄物" value="2" />);
            items.push(<Picker.Item key="3" label="3:土壌等" value="3" />);
            items.push(<Picker.Item key="4" label="4:コンクリート殻等" value="4" />);
            items.push(<Picker.Item key="5" label="5:アスファルト混合物" value="5" />);
            items.push(<Picker.Item key="6" label="6:3、4、5以外の混合物・不燃物" value="6" />);
            items.push(<Picker.Item key="10" label="10:屋外残置廃棄物_可燃物" value="10" />);
            items.push(<Picker.Item key="11" label="11:屋外残置廃棄物_不燃物" value="11" />);
            items.push(<Picker.Item key="12" label="12:仮置場解体発生可燃物" value="12" />);
            items.push(<Picker.Item key="13" label="13:仮置場解体発生不燃物" value="13" />);
            break;
        }        
        return items;
      }
      return(
        <Picker
          selectedValue={selectRmSolType}
          onValueChange={(itemValue, itemIndex) => setSelectRmSolType(itemValue)}
          style={[styles.pickerStyle]}
        >
          {makeList()}
        </Picker>
      )
    };
    //荷姿種別
    const makePickerPkTyp = () => {
      return(
        <Picker
          selectedValue={selectPkTyp}
          onValueChange={(itemValue, itemIndex) => setSelectPkTyp(itemValue)}
          style={[styles.pickerStyle]}
        >
          <Picker.Item key="" label="未選択" value="" />
          <Picker.Item key="1" label="耐候性大型土のう" value="1" />
          <Picker.Item key="2" label="クロス型大型土のう袋等" value="2" />
          <Picker.Item key="3" label="ランニング型大型土のう袋等_Ⅰ" value="3" />
          <Picker.Item key="4" label="ランニング型大型土のう袋等_Ⅰ" value="4" />
          <Picker.Item key="5" label="フレキシブルコンテナ耐候性（3年）" value="5" />
          <Picker.Item key="6" label="フレキシブルコンテナ耐水・耐候性（3年）" value="6" />
          <Picker.Item key="7" label="その他" value="7" />
          <Picker.Item key="8" label="耐候（オーバーパック）" value="8" />
          <Picker.Item key="9" label="耐水・耐候（オーバーパック）" value="9" />
        </Picker>
      )
    };
    //内袋の利用方法
    const makePickerUsgInnBg = () => {
      return(
        <Picker
          selectedValue={selectUsgInnBg}
          onValueChange={(itemValue, itemIndex) => setSelectUsgInnBg(itemValue)}
          style={[styles.pickerStyle]}
        >
          <Picker.Item key="" label="未選択" value="" />
          <Picker.Item key="1" label="内袋なし" value="1" />
          <Picker.Item key="2" label="1重内袋" value="2" />
          <Picker.Item key="3" label="2重内袋（内袋をあらかじめ2重にした後に内容物を格納）" value="3" />
          <Picker.Item key="4" label="2重内袋（1重の内袋に内容物を格納した後に2重化）" value="4" />
          <Picker.Item key="5" label="アルミ内袋" value="5" />
          <Picker.Item key="6" label="ポリエチレン内袋_二重以上" value="6" />
          <Picker.Item key="7" label="ポリエチレン内袋_一重" value="7" />
          <Picker.Item key="8" label="その他内袋_二重以上" value="8" />
          <Picker.Item key="9" label="その他内袋_一重" value="9" />
        </Picker>
      )
    };
    //津波浸水域由来
    const makePickerTsuInd = () => {
      return(
        <Picker
          selectedValue={selectTsuInd}
          onValueChange={(itemValue, itemIndex) => setSelectTsuInd(itemValue)}
          style={[styles.pickerStyle]}
        >
          <Picker.Item key="" label="未選択" value="" />          
          <Picker.Item key="1" label="津波浸水域由来" value="1" />
          <Picker.Item key="2" label="津波浸水域由来以外" value="2" />
        </Picker>
      )
    };
    //特定施設由来
    const makePickerSplFac = () => {
      return(
        <Picker
          selectedValue={selectSplFac}
          onValueChange={(itemValue, itemIndex) => setSelectSplFac(itemValue)}
          style={[styles.pickerStyle]}
        >
          <Picker.Item key="" label="未選択" value="" />          
          <Picker.Item key="1" label="特定施設由来" value="1" />
          <Picker.Item key="2" label="特定施設由来以外" value="2" />
        </Picker>
      )
    };            
    //アルミ内袋の利用
    const makePickerUsgAluBg = () => {
      return(
        <Picker
          selectedValue={selectUsgAluBg}
          onValueChange={(itemValue, itemIndex) => setSelectUsgAluBg(itemValue)}
          style={[styles.pickerStyle]}
        >
          <Picker.Item key="" label="未選択" value="" />          
          <Picker.Item key="1" label="利用あり" value="1" />
          <Picker.Item key="2" label="利用なし" value="2" />
        </Picker>
      )
    };


    return (
      <View style={styles.container}>
          {/* ヘッダ */}
          <FunctionHeader appType={"現"} viewTitle={"必須情報設定"} functionTitle={"紐付(土)"}/>
      
          {/* 上段 */}
          <View  style={[styles.main,styles.topContent]}>
            <Text style={[styles.labelText]}>新タグID：{newTagId}</Text>
            <Text style={[styles.labelText]}>旧タグ数：{WA1060OldTagInfos.length}</Text>
            
            <View style={styles.tableMain}>
              <View style={[styles.tableRow,styles.pickerContainer]}>
                <View style={styles.tableCell}><Text style={[styles.pickerLabelText,styles.alignRight]}>除去土壌等種別：</Text></View>
                <View style={[styles.tableCell,styles.pickerStyle,]}>{makePickerRmSolTyp()}</View>
              </View>
              <View style={[styles.tableRow,styles.pickerContainer]}>
                <View style={styles.tableCell}><Text style={[styles.pickerLabelText,styles.alignRight]}>荷姿種別：</Text></View>
                <View style={[styles.tableCell,styles.pickerStyle]}>{makePickerPkTyp()}</View>
              </View>
              <View style={[styles.tableRow,styles.pickerContainer]}>
                <View style={styles.tableCell}><Text style={[styles.pickerLabelText,styles.alignRight]}>内袋の利用方法：</Text></View>
                <View style={[styles.tableCell,styles.pickerStyle]}>{makePickerUsgInnBg()}</View>
              </View>
              <View style={[styles.tableRow,styles.pickerContainer]}>
                <View style={styles.tableCell}><Text style={[styles.pickerLabelText,styles.alignRight]}>津波浸水域由来：</Text></View>
                <View style={[styles.tableCell,styles.pickerStyle]}>{makePickerTsuInd()}</View>
              </View>
              <View style={[styles.tableRow,styles.pickerContainer]}>
                <View style={styles.tableCell}><Text style={[styles.pickerLabelText,styles.alignRight]}>特定施設由来：</Text></View>
                <View style={[styles.tableCell,styles.pickerStyle]}>{makePickerSplFac()}</View>
              </View>
              <View style={[styles.tableRow,styles.pickerContainer]}>
                <View style={styles.tableCell}><Text style={[styles.pickerLabelText,styles.alignRight]}>アルミ内袋の利用：</Text></View>
                <View style={[styles.tableCell,styles.pickerStyle]}>{makePickerUsgAluBg()}</View>
              </View>
              <View style={[styles.tableRow,styles.pickerContainer]}>
                <View style={[styles.tableCell,styles.checkboxContainer]}><Text style={[styles.pickerLabelText]}>オーバーパック有無：                            
                </Text>
                <CheckBox
                    disabled={isCheckable}
                    value={checkYesNoOP}
                    onValueChange={(check) => setCheckYesNoOP(check)}
                    style={styles.checkBox}
                    tintColors={(!isCheckable) ? { true: 'black', false: 'black' } : { true: 'grey', false: 'grey' }}
                  />  
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
export default WA1063;