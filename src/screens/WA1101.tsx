/**-------------------------------------------
 * A01-0100_新タグID参照(灰)
 * WA1101
 * screens/WA1101.tsx
 * ---------------------------------------------*/
import FunctionHeader from '../components/FunctionHeader.tsx'; // Headerコンポーネントのインポート
import Footer from '../components/Footer.tsx'; // Footerコンポーネントのインポート
import { styles } from '../styles/CommonStyle.tsx'; // 共通スタイル
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { logUserAction, logScreen  } from '../utils/Log.tsx';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootList } from '../navigation/AppNavigator.tsx';
import { useRecoilValue,useSetRecoilState } from "recoil";
import { WA1100DataState,WA1101BackState } from "../atom/atom.tsx";

// WA1101 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'WA1101'>;
interface Props {
  navigation: NavigationProp;
};
const WA1101 = ({navigation}:Props) => {
    const WA1100Data = useRecoilValue(WA1100DataState);
    const setBack = useSetRecoilState(WA1101BackState);
    /************************************************
     * 初期表示設定
     ************************************************/   
    useEffect(() => {
    }, []);

    /************************************************
     * 戻るボタン処理
     ************************************************/
    const btnAppBack = async () => {
      await logUserAction(`ボタン押下: 戻る(WA1101)`);
      setBack(true);      
      await logScreen(`画面遷移:WA1100_新タグ参照(土壌)`);  
      navigation.navigate('WA1100');
    };

    /************************************************
     * メニューボタン処理
     ************************************************/
    const btnMenu = async () => {
      await logUserAction(`ボタン押下: メニュー(WA1101)`);  
      await logScreen(`画面遷移:WA1040_メニュー`);  
      navigation.navigate('WA1040');
    };

    return (
      <View style={styles.container}>
        {/* ヘッダ */}
        <FunctionHeader appType={"現"} viewTitle={"新タグ参照"} functionTitle={"参照(灰)"}/>
    
        {/* 上段 */}
        <View  style={[styles.main]}>
          <Text style={[styles.labelText]}>仮置場：{WA1100Data?.data.tmpLocNm}</Text>
          <Text style={[styles.labelText]}>新タグID：{WA1100Data?.head.newTagId}</Text>
          <Text style={[styles.labelText]}>旧タグID：{WA1100Data?.data.oldTagId}</Text>
        </View>

        {/* 中段2 */}
        <View  style={[styles.textareaContainer,styles.middleContent]}>
          <View style={styles.tableMain}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text style={[styles.labelText,styles.alignRight]}>重量(Kg)：</Text></View>
              <View style={styles.tableCell}><Text style={styles.labelText}>{WA1100Data?.data.surDsWt}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text style={[styles.labelText,styles.alignRight]}>線量(μSv/h)：</Text></View>
              <View style={styles.tableCell}><Text style={styles.labelText}>{WA1100Data?.data.surDsRt}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text style={[styles.labelText,styles.alignRight]}>測定放射能濃度：</Text></View>
              <View style={styles.tableCell}><Text style={styles.labelText}>{WA1100Data?.data.meaRa}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}><Text style={[styles.labelText,styles.alignRight]}>(Bq/Kg)　</Text></View>
              <View style={styles.tableCell}><Text style={styles.labelText}></Text></View>
            </View>
          </View>
        </View>

        {/* 中段2 */}
        <Text style={[styles.labelText,styles.main]}>メモ：</Text>
        <View  style={[styles.textareaContainer,styles.middleContent]}>
          <View style={[styles.scrollContainer]}>
              <ScrollView
                style={[styles.scrollViewStyle]}
                showsVerticalScrollIndicator={true}
              >
                <Text style={styles.labelText}>{WA1100Data?.data.lnkNewTagDatMem}</Text>
              </ScrollView>   
          </View>
        </View>

        {/* 下段 */}
        <View style={[styles.bottomSection,styles.settingMain]}>
          <TouchableOpacity style={[styles.button, styles.settingButton,styles.settingButton3]} onPress={btnAppBack}>
            <Text style={styles.endButtonText}>戻る</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.settingButton,styles.settingButton]} onPress={btnMenu}>
            <Text style={[styles.endButtonText,styles.settingButtonText1]}>メニュー</Text>
          </TouchableOpacity>                    
        </View>

        {/* フッタ */}
        <Footer /> 

      </View>
    );
    
};
export default WA1101;