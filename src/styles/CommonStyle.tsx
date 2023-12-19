/**-------------------------------------------
 * 共通_スタイルシート
 * styles/CommonStyle.tsx
 * ---------------------------------------------*/
import { StyleSheet } from 'react-native';
// 基準サイズ
const baseSize = 16;

// ピクセルをremに変換する関数
const rem = (px:number) => px / baseSize;

export const styles = StyleSheet.create({
  fontAndColor:{
    color: '#000',
    fontFamily:"ipaexg",
  },
  //--------メイン--------
  container: {
    flex: 1,
    justifyContent: 'space-between', // 3つのセクションを縦に均等に配置
    backgroundColor: '#fff', // 背景色は白
  },
  containerWithKeybord: {
    justifyContent: 'center' ,
    backgroundColor: '#fff', // 背景色は白
  },  
  main:{
    marginRight:30,
    marginLeft:30,
  },
  textareaContainer:{
    marginRight:10,
    marginLeft:10,
  },
  textareaContainerSecond:{
    maxHeight:"10%"
  },  
  middleContent: {
    flex: 1,
    justifyContent: 'center',
  },  
  topContent: {
    flex: 1,
 //   justifyContent: 'center',
  }, 
  center:{
    alignItems: 'center',
  },
  //--------------------  
  //--------ヘッダ--------
  headerContainer: {
    padding: 5,
    backgroundColor: '#1E74BD', // ヘッダの背景色
    height: 40,
    zIndex:1,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    fontFamily:"ipaexg",
  },
  //--------------------
  //--------機能ヘッダ--------
  functionHeaderContainer: {
    padding: 5,
    flexDirection: 'row',
    flexWrap: 'wrap', // 子要素が親要素の幅を超えたら折り返す
    justifyContent: 'space-between',  
    alignItems: 'center',      
    backgroundColor: '#1E74BD', // ヘッダの背景色
    height: 40,
    zIndex:1,
  },
  functionHeaderLeft: {
    fontSize: 16,
    marginLeft: 10, // 適切な余白を設定
    color: 'white',
    fontWeight: 'bold',
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    flex: 1, // この行を追加
    textAlign: 'left', // 左寄せ
    fontFamily:"ipaexg",
  },
  functionHeaderMiddle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    flex: 1, // この行を追加
    textAlign: 'center', // 中央寄せ    
    fontFamily:"ipaexg",
  },
  functionHeaderRight: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    flex: 1, // この行を追加
    textAlign: 'right', // 右寄せ
    fontFamily:"ipaexg",
  },
  //--------------------  
  //--------ラベル-------
  labelText: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    fontFamily:"ipaexg",
    color:'#000'
  },
  labelTextPlace: {
    marginLeft: 75,
    fontFamily:"ipaexg",
  },  
  //--------------------
  //--------テキストボックス-------
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row', // 子要素を横並びにする
    justifyContent: 'center', // 子要素を親要素の左端に揃える
  },
  inputWithText: {
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
    fontFamily:"ipaexg",
    color:'#000',
  },  
  input: {
    borderWidth: 1, // 枠線の幅
    borderColor: 'black', // 枠線の色
    padding: 10,
    height: 40, 
    minWidth: 200, // テキストボックスの最小幅
    textAlign: 'center',
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
  },



  //--------ボタン-------
  button: {
    backgroundColor: '#548236', // パステルな水色
    padding: 5,
    margin: 5,
    borderRadius: 15,
    height: 60,
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
  },
  buttonRead: {
    marginRight:'10%',
    marginLeft:'10%',
  },  
  buttonSmall: {
    marginRight:'20%',
    marginLeft:'20%',
  },  
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontFamily:"ipaexg",
  },  
  centerButton:{
    alignItems: 'center', // 子要素を水平方向に中央揃え
    margin: 20,
  },
  startButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',    
  },
  endButtonText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily:"ipaexg",
  },
  endButton: {
    backgroundColor: '#F1D2C1',
    padding: 5,
    flex: 1,
  },
  endButtonSmall: {
    backgroundColor: '#F1D2C1',
    padding: 5,
    height:50,
    width:"48%"
  },  
  startButton: {
    backgroundColor: '#1e74bd', 
    padding: 10,
    flex: 1,
  },
  //--------------------
  //--------カメラ-------
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshair: {
    position: 'absolute',
    width: 2,
    height: '30%',
    backgroundColor: 'white',
    opacity: 0.5, //透明度50%
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: '40%',
    height: 2,
    backgroundColor: 'white',
    opacity: 0.5, //透明度50%
  },
  camera: {
    flex: 1,
  },
  cameraBottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 5,
    zIndex:1,
    backgroundColor: "#000"
  },  
  //--------------------  
  //--------メニュー-------
  menuMain: {
    flexDirection: 'row', // 子要素を横並びにする
    flexWrap: 'wrap', // 子要素が親要素の幅を超えたら折り返す
    justifyContent: 'flex-start', // 子要素を親要素の左端に揃える
    paddingTop:10,
    paddingLeft:45,
    paddingRight:45,
  },
  menuButton: {
    width: '48%', // 画面幅の半分のサイズ
    height: 80,
    backgroundColor: '#548236', // パステルな水色
    marginBottom: 2,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
    marginLeft:2,
    marginRight:2,
  },
  menuButtonText1: {
    fontSize: 18,
    color: 'white',
    fontFamily:"ipaexg",
  }, 
  menuButtonText2: {
    fontSize: 18,
    color: 'black',
    fontFamily:"ipaexg",
  }, 
  menuButton1:{
    backgroundColor: '#6f4b3e', 
  },
  menuButton2:{
    backgroundColor: '#767171', 
  },
  menuButton3:{
    backgroundColor: '#7b4d28', 
  },
  menuButton4:{
    backgroundColor: '#8497b0', 
  },
  menuButton5:{
    backgroundColor: '#c39143', 
  },
  menuButton6:{
    backgroundColor: '#d0cece', 
  },
  menuButton7:{
    backgroundColor: '#4e76ce', 
  },
  menuButton8:{
    backgroundColor: '#2cae2c', 
  },
  menuButton9:{
    backgroundColor: '#ffd966', 
  },                
  //--------------------
  //--------端末設定-------
  settingMain: {
    flexDirection: 'row', // 子要素を横並びにする
    flexWrap: 'wrap', // 子要素が親要素の幅を超えたら折り返す
    justifyContent: 'flex-start', // 子要素を親要素の左端に揃える
    paddingTop:10,
    paddingLeft:10,
    paddingRight:10,
  },
  settingButton: {
    width: '45%', // 画面幅の半分のサイズ
    height: 60,
    marginRight: 'auto', // 右のマージンを自動調整
    marginLeft: 'auto', // 左のマージンを自動調整  },
    backgroundColor: '#1e74bd', // パステルな水色
    marginBottom: 5,
    padding: 0,
    borderRadius: 15,
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
  },
  settingButton1: {
    backgroundColor: '#fff2cc'
  },
  settingButton2: {
    backgroundColor: '#1e74bd'
  },
  settingButton3: {
    backgroundColor: '#f1d2c1'
  },
  settingButtonDisabled: {
    backgroundColor: '#ccc', // 無効化したときの背景色
    color: '#999', // 無効化したときのテキスト色
  },
  settingButtonText1: {
    color: 'white',
    fontFamily:"ipaexg",
  },
  labelTextSetting: {
    fontSize: 15,
    marginTop:1,
    marginBottom:1,
    fontFamily:"ipaexg",
    color:"#000"
  },  
  labelTextSettingDtl: {
    marginLeft: 10,
    fontFamily:"ipaexg",
  }, 
  scrollContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:3,
    marginBottom:3,
  },
  scrollContainerSecond: {
    maxHeight:"30%"
  },  
  scrollViewStyle: {
    width: 'auto', // または必要な幅に設定
    maxWidth:'100%',
    minWidth: '90%', // または必要な幅に設定
    borderWidth: 1, // 枠線の幅
    borderColor: '#000', // 枠線の色
    borderRadius: 5, // 枠の角を丸くする場合
    paddingLeft:5,
    paddingRight:5,
  },  
  scrollViewStyleSecond: {
    height:"30%"
  },    
  scrollViewStyleTop: {
  },  
  innerScrollViewStyle: {
    width: "100%", // または必要な幅に設定
  },
  //--------------------  
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 5,
    zIndex:1,
  },
  // 送信ボタンが無効の時のスタイル
  disabledButton:{
    backgroundColor: '#ccc', // 無効化したときの背景色
    color: '#999', // 無効化したときのテキスト色
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  //--------------------    
  //--------テーブル-------
  tableMain: {
    width: '100%', // テーブルの幅を指定
    // 他のスタイル
  },
  tableRow: {
    flexDirection: 'row', // 行のスタイル
    // 他のスタイル
  },
  tableCell: {
    flex: 1, // セルのスタイル
    // 他のスタイル
  },
  //--------------------    
  //--------モーダル-------
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  modalMessage: {
    textAlign: 'center',
  },
  //--------------------
  //--------カスタムアラート-------
  alertView: {
    width:'50%',
    backgroundColor: "#f2f2f2",

  },
  alertButtonContainer: {
    borderTopColor: '#000', // ボーダーの色をグレーに設定
    borderTopWidth: 1, // ボーダーの太さを1に設定
    flexDirection: 'row',
    alignItems: "center",
  },
  alertButton: {
    flex: 1,// ボタンに利用可能なスペースを等分に使用
    borderRadius: 7,
    padding: 10,
    margin:1,
    marginLeft:2,
    marginRight:2,
    width:'45%',
  },
  alertButtonCancel: {
    backgroundColor: "#f1d2c1", // 薄いピンク    
  },
  alertButtonConfirm: {
    backgroundColor: "#007AFF", // 青色    
  },
  alertTitleBar: {
    backgroundColor: '#1e74bd', // 青色
    height: 40,
    padding: 10,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: 'center', 
  },
  alertTitle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily:"ipaexg",
  },
  alertMessage: {
    fontFamily:"ipaexg",
    color: "black", // テキストが黒色の場合
    paddingTop: 5,
    paddingBottom: 40,
    fontWeight: "bold",
    textAlign: "center",
  },  
  alertTextConfirm: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily:"ipaexg",
  },  
  alertTextCancel: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily:"ipaexg",
  },
  //--------------------        
  //--------フッタ--------
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#000', // フッターの背景色
    zIndex:2,
  },
  footerText: {
    fontSize: 15,
    color: '#fff',
    height: 20,
    fontFamily:"ipaexg",
  },
  serverNameText: {
    textAlign: 'left',
  },
  copyrightText: {
    textAlign: 'right',
  },  
  //--------------------    
});