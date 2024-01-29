/**-------------------------------------------
 * カスタム通知プロバイダ
 * react内で呼べるようにトップ層でレンダリング処理
 * components/AlertContext.tsx
 * ---------------------------------------------*/
import React, {createContext, useState, useContext, ReactNode} from 'react';
import CustomAlert from './CustomAlert'; // TypeScriptに変更したコンポーネントをインポート

interface AlertContextType {
  alert: {
    visible: boolean;
    title: string;
    message: string;
    resolve: (result: boolean) => void;
    showCancelButton: boolean;
  };
  showAlert: (
    title: string,
    message: string,
    showCancelButton: boolean,
  ) => Promise<boolean>;
  hideAlert: (result: boolean) => void;
}
interface Props {
  children: ReactNode; // 子要素の型を定義
}

const AlertContext = createContext<AlertContextType>({} as AlertContextType);
export const useAlert = () => useContext(AlertContext);
export const AlertProvider = ({children}: Props) => {
  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    message: '',
    resolve: (_result: boolean) => {},
    showCancelButton: true,
  });

  /************************************************
   * カスタム通知呼び出し関数
   ************************************************/
  const showAlert = (
    title: string,
    message: string,
    showCancelButton: boolean,
  ): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      setAlert({visible: true, title, message, resolve, showCancelButton});
    });
  };

  const hideAlert = (result: boolean) => {
    if (alert.resolve) {
      alert.resolve(result);
    }
    setAlert({...alert, visible: false});
  };

  return (
    <AlertContext.Provider value={{alert, showAlert, hideAlert}}>
      {children}
      {alert.visible && (
        <CustomAlert
          title={alert.title}
          message={alert.message}
          onConfirm={() => hideAlert(true)}
          onCancel={() => hideAlert(false)}
          showCancelButton={alert.showCancelButton}
        />
      )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
