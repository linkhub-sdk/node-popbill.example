/**
 * 업데이트 일자 : 2024-02-26
 *    연동 기술지원 연락처 : 1600-9854
 *    연동 기술지원 이메일 : code@linkhubcorp.com
 *            
 *    <테스트 연동개발 준비사항>
 *    1) API Key 변경 (연동신청 시 메일로 전달된 정보)
 *        - LinkID : 링크허브에서 발급한 링크아이디
 *        - SecretKey : 링크허브에서 발급한 비밀키
 *    2) SDK 환경설정 옵션 설정
 *        - IsTest : 연동환경 설정, true-테스트, false-운영(Production), (기본값:true)
 *        - IPRestrictOnOff : 인증토큰 IP 검증 설정, true-사용, false-미사용, (기본값:true)
 *        - UseStaticIP : 통신 IP 고정, true-사용, false-미사용, (기본값:false)
 *        - UseLocalTimeYN : 로컬시스템 시간 사용여부, true-사용, false-미사용, (기본값:true)
 */
var popbill = require("popbill");

/**
 * 팝빌 서비스 연동환경 초기화
 */
popbill.config({
    // 링크아이디
    LinkID: "TESTER",

    // 비밀키
    SecretKey: "SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=",

    // 연동환경 설정, true-테스트, false-운영(Production), (기본값:false)
    IsTest: true,

    // 통신 IP 고정, true-사용, false-미사용, (기본값:false)
    IPRestrictOnOff: true,

    // 팝빌 API 서비스 고정 IP 사용여부, 기본값(false)
    UseStaticIP: false,

    // 로컬시스템 시간 사용여부, true-사용, false-미사용, (기본값:true)
    UseLocalTimeYN: true,

    // function 타입이 아닌 error 를 파라미터로 넣고 API 요청에 대한 응답이 실패할 경우 동작하게 되는 handler.
    defaultErrorHandler: function (Error) {
        console.log("Error Occur : [" + Error.code + "] " + Error.message);
    },
});
