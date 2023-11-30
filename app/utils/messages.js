const messages = {
    EA5001: (v1) => `${v1}の読取を確認できませんでした。\n再度やり直しを行うか、ヘルプデスクにお問い合わせください。`,
    EA5002: (v1) => `正しい${v1}QRコードの確認ができませんでした。\nQRコードが正しいか確認し再度やり直しを行うか、ヘルプデスクにお問い合わせください。`,
    EA5003: () => `サーバーに接続できませんでした。\n通信状況を確認し再度やり直しを行うか、ヘルプデスクにお問い合わせください。`,
    EA5004: (v1,v2) => `${v1}でサーバーエラーが発生しました。\nヘルプデスクにお問い合わせください。\n\nHTTPステータス： ${v2}`,
    EA5005: (v1,v2) => `${v1}でシステムエラーが発生しました。\nヘルプデスクにお問い合わせください。\n\nサーバーエラーコード： ${v2}`,
    EA5006: (v1) => `正しい${v1}QRコードの確認ができませんでした。\nQRコードが正しいか確認し再度やり直しを行うか、ヘルプデスクにお問い合わせください。`,
    EA5007: () => `作業場所QRコードが仮置場ではありません。\nQRコードが正しいか確認し再度やり直しを行うか、ヘルプデスクにお問い合わせください。`,
    EA5008: () => `読み取ったコードがバーコードまたはQRコードではありませんでした。\nコードが正しいか確認し再度やり直しを行うか、ヘルプデスクにお問い合わせください。`,
    EA5009: () => `QRコードのデータを正しく読み込めませんでした。\nコードが正しいか確認し再度やり直しを行うか、ヘルプデスクにお問い合わせください。`,
    EA5010: () => `既に読み込まれている旧タグIDの除去土壌等種別と異なる旧タグIDが読み込まれました。\nフレコンが正しいか確認し再度やり直しを行うか、ヘルプデスクにお問い合わせください。`,
    
        // その他のメッセージ
  };
  
  export default messages;