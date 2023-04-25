var express = require("express");
var router = express.Router();
var popbill = require("popbill");

/*
 * 카카오톡 API 모듈 초기화
 */
var kakaoService = popbill.KakaoService();

/*
 * Kakao API Index 목록
 */
router.get("/", function (req, res, next) {
  res.render("Kakao/index", {});
});

/*
 * 카카오톡 채널을 등록하고 내역을 확인하는 카카오톡 채널 관리 페이지 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/channel#GetPlusFriendMgtURL
 */
router.get("/getPlusFriendMgtURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  kakaoService.getPlusFriendMgtURL(
    testCorpNum,
    testUserID,
    function (url) {
      res.render("result", {
        path: req.path,
        result: url,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 팝빌에 등록한 연동회원의 카카오톡 채널 목록을 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/channel#ListPlusFriendID
 */
router.get("/listPlusFriendID", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  kakaoService.listPlusFriendID(
    testCorpNum,
    function (response) {
      res.render("Kakao/listPlusFriendID", {
        path: req.path,
        result: response,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 카카오톡 발신번호 등록여부를 확인합니다.
 * - 발신번호 상태가 "승인"인 경우에만 리턴값 "Response"의 변수 "code"가 1로 반환됩니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/sendnum#CheckSenderNumber
 */
router.get("/checkSenderNumber", function (req, res, next) {
  // 팝빌회원 사업자번호
  var testCorpNum = "1234567890";

  // 확인할 발신번호
  var senderNumber = "";

  kakaoService.checkSenderNumber(
    testCorpNum,
    senderNumber,
    function (result) {
      res.render("response", {
        path: req.path,
        code: result.code,
        message: result.message,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 발신번호를 등록하고 내역을 확인하는 카카오톡 발신번호 관리 페이지 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/sendnum#GetSenderNumberMgtURL
 */
router.get("/getSenderNumberMgtURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  kakaoService.getSenderNumberMgtURL(
    testCorpNum,
    testUserID,
    function (url) {
      res.render("result", {
        path: req.path,
        result: url,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 팝빌에 등록한 연동회원의 카카오톡 발신번호 목록을 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/sendnum#GetSenderNumberList
 */
router.get("/getSenderNumberList", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  kakaoService.getSenderNumberList(
    testCorpNum,
    function (response) {
      res.render("Kakao/getSenderNumberList", {
        path: req.path,
        result: response,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 알림톡 템플릿을 신청하고 승인심사 결과를 확인하며 등록 내역을 확인하는 알림톡 템플릿 관리 페이지 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/template#GetATSTemplateMgtURL
 */
router.get("/getATSTemplateMgtURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  kakaoService.getATSTemplateMgtURL(
    testCorpNum,
    testUserID,
    function (url) {
      res.render("result", {
        path: req.path,
        result: url,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 승인된 알림톡 템플릿 정보를 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/template#GetATSTemplate
 */
router.get("/getATSTemplate", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 확인할 템플릿 코드
  var templateCode = "022040000374";

  kakaoService.getATSTemplate(
    testCorpNum,
    templateCode,
    function (response) {
      res.render("Kakao/getATSTemplate", {
        path: req.path,
        result: response,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 승인된 알림톡 템플릿 목록을 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/template#ListATSTemplate
 */
router.get("/listATSTemplate", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  kakaoService.listATSTemplate(
    testCorpNum,
    function (response) {
      res.render("Kakao/listATSTemplate", {
        path: req.path,
        result: response,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 승인된 템플릿의 내용을 작성하여 1건의 알림톡 전송을 팝빌에 접수합니다.
 * - 사전에 승인된 템플릿의 내용과 알림톡 전송내용(content)이 다를 경우 전송실패 처리됩니다.
 * - 전송실패 시 사전에 지정한 변수 "altSendType" 값으로 대체문자를 전송할 수 있고 이 경우 문자(SMS/LMS) 요금이 과금됩니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/send#SendATSOne
 */
router.get("/sendATS_one", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 승인된 알림톡 템플릿코드
  // └ 알림톡 템플릿 관리 팝업 URL(GetATSTemplateMgtURL API) 함수, 알림톡 템플릿 목록 확인(ListATStemplate API) 함수를 호출하거나
  //   팝빌사이트에서 승인된 알림톡 템플릿 코드를  확인 가능.
  var templateCode = "022040000005";

  // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
  // ※ 대체문자를 전송하는 경우에는 사전에 등록된 발신번호 입력 필수
  var Sender = "";

  // 알림톡 내용 (최대 1000자)
  var content = "[ 팝빌 ]\n";
  content +=
    "신청하신 #{템플릿코드}에 대한 심사가 완료되어 승인 처리되었습니다.\n";
  content += "해당 템플릿으로 전송 가능합니다.\n\n";
  content += "문의사항 있으시면 파트너센터로 편하게 연락주시기 바랍니다.\n\n";
  content += "팝빌 파트너센터 : 1600-8536\n";
  content += "support@linkhub.co.kr";

  // 대체문자 제목
  // - 메시지 길이(90byte)에 따라 장문(LMS)인 경우에만 적용.
  var altSubject = "알림톡 대체 문자 제목";

  // 대체문자 유형(altSendType)이 "A"일 경우, 대체문자로 전송할 내용 (최대 2000byte)
  // └ 팝빌이 메시지 길이에 따라 단문(90byte 이하) 또는 장문(90byte 초과)으로 전송처리
  var altContent = "알림톡 대체 문자";

  // 대체문자 유형 (null , "C" , "A" 중 택 1)
  // null = 미전송, C = 알림톡과 동일 내용 전송 , A = 대체문자 내용(altContent)에 입력한 내용 전송
  var altSendType = "C";

  // 예약전송일시, yyyyMMddHHmmss
  // - 분단위 전송, 미입력 시 즉시 전송
  var sndDT = "";

  // 수신번호
  var receiver = "";

  // 수신자 이름
  var receiverName = "partner";

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  // 전송요청번호
  // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
  // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
  var requestNum = "";

  // 알림톡 버튼정보를 템플릿 신청시 기재한 버튼정보와 동일하게 전송하는 경우 btns를 null 처리.
  var btns = null;

  // 알림톡 버튼 URL에 #{템플릿변수}를 기재한경우 템플릿변수 영역을 변경하여 버튼정보 구성
  // var btns = [
  //     {
  //         n: "템플릿 안내",               //버튼명
  //         t: "WL",                      //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
  //         u1: "https://www.popbill.com", //[앱링크-iOS, 웹링크-Mobile]
  //         u2: "http://www.popbill.com"  //[앱링크-Android, 웹링크-PC URL]
  //     }
  // ];

  kakaoService.sendATS_one(
    testCorpNum,
    templateCode,
    Sender,
    content,
    altSubject,
    altContent,
    altSendType,
    sndDT,
    receiver,
    receiverName,
    UserID,
    requestNum,
    btns,
    function (receiptNum) {
      res.render("Kakao/receiptNum", {
        path: req.path,
        receiptNum: receiptNum,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 승인된 템플릿의 내용을 작성하여 다수건의 알림톡 전송을 팝빌에 접수하며, 수신자 별로 개별 내용을 전송합니다. (최대 1,000건)
 * - 사전에 승인된 템플릿의 내용과 알림톡 전송내용(content)이 다를 경우 전송실패 처리됩니다.
 * - 전송실패 시 사전에 지정한 변수 "altSendType" 값으로 대체문자를 전송할 수 있고, 이 경우 문자(SMS/LMS) 요금이 과금됩니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/send#SendATSMulti
 */
router.get("/sendATS_multi", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 승인된 알림톡 템플릿코드
  // └ 알림톡 템플릿 관리 팝업 URL(GetATSTemplateMgtURL API) 함수, 알림톡 템플릿 목록 확인(ListATStemplate API) 함수를 호출하거나
  //   팝빌사이트에서 승인된 알림톡 템플릿 코드를  확인 가능.
  var templateCode = "022040000005";

  // 알림톡 내용 (최대 1000자)
  // 알림톡 템플릿 신청시 내용에 #{템플릿변수}를 기재한경우 템플릿변수 영역을 변경하여 내용 구성
  var content = "[ 팝빌 ]\n";
  content +=
    "신청하신 #{템플릿코드}에 대한 심사가 완료되어 승인 처리되었습니다.\n";
  content += "해당 템플릿으로 전송 가능합니다.\n\n";
  content += "문의사항 있으시면 파트너센터로 편하게 연락주시기 바랍니다.\n\n";
  content += "팝빌 파트너센터 : 1600-8536\n";
  content += "support@linkhub.co.kr";

  // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
  // ※ 대체문자를 전송하는 경우에는 사전에 등록된 발신번호 입력 필수
  var Sender = "";

  // 대체문자 유형 (null , "C" , "A" 중 택 1)
  // null = 미전송, C = 알림톡과 동일 내용 전송 , A = 대체문자 내용(altContent)에 입력한 내용 전송
  var altSendType = "C";

  // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
  var sndDT = "";

  // [배열] 알림톡 전송정보 (최대 1000개)
  var msgs = [];
  msgs.push({
    rcv: "", //수신번호
    rcvnm: "popbill", //수신자명
    msg: content, //알림톡 내용
    altsjt: "대체문자 제목1", // 대체문자 제목
    altmsg: "알림톡 대체 문자_0", //대체문자 내용
    interOPRefKey: "20220629-01", // 파트너 지정키, 수신자 구별용 메모
  });
  msgs.push({
    rcv: "",
    rcvnm: "linkhub",
    msg: content,
    altmsg: "알림톡 대체 문자_1",
    interOPRefKey: "20220629-02", // 파트너 지정키, 수신자 구별용 메모
    btns: [
      //수신자별 개별 버튼내용 전송시
      {
        n: "템플릿 안내 TEST", //버튼명
        t: "WL", //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
        u1: "https://www.popbill.com", //[앱링크-iOS, 웹링크-Mobile]
        u2: "http://www.popbill.com", //[앱링크-Android, 웹링크-PC URL]
      },
    ],
  });

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  // 전송요청번호
  // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
  // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
  var requestNum = "";

  // 알림톡 버튼정보를 템플릿 신청시 기재한 버튼정보와 동일하게 전송하는 경우 btns를 null처리.
  // 수신자별 개별 버늩내용 전송하는 경우 btns를 null 처리.
  // 알림톡 버튼 URL에 #{템플릿변수}를 기재한경우 템플릿변수 영역을 변경하여 버튼정보 구성
  var btns = null;
  // btns = [
  //     {
  //         n: "템플릿 안내",               //버튼명
  //         t: "WL",                      //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
  //         u1: "https://www.popbill.com", //[앱링크-iOS, 웹링크-Mobile]
  //         u2: "http://www.popbill.com"  //[앱링크-Android, 웹링크-PC URL]
  //     }
  // ];

  kakaoService.sendATS_multi(
    testCorpNum,
    templateCode,
    Sender,
    altSendType,
    sndDT,
    msgs,
    UserID,
    requestNum,
    btns,
    function (receiptNum) {
      res.render("Kakao/receiptNum", {
        path: req.path,
        receiptNum: receiptNum,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 승인된 템플릿 내용을 작성하여 다수건의 알림톡 전송을 팝빌에 접수하며, 모든 수신자에게 동일 내용을 전송합니다. (최대 1,000건)
 * - 사전에 승인된 템플릿의 내용과 알림톡 전송내용(content)이 다를 경우 전송실패 처리됩니다.
 * - 전송실패시 사전에 지정한 변수 "altSendType" 값으로 대체문자를 전송할 수 있고, 이 경우 문자(SMS/LMS) 요금이 과금됩니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/send#SendATSSame
 */
router.get("/sendATS_same", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 승인된 알림톡 템플릿코드
  // └ 알림톡 템플릿 관리 팝업 URL(GetATSTemplateMgtURL API) 함수, 알림톡 템플릿 목록 확인(ListATStemplate API) 함수를 호출하거나
  //   팝빌사이트에서 승인된 알림톡 템플릿 코드를  확인 가능.
  var templateCode = "022040000005";

  // 알림톡 내용 (최대 1000자)
  var content = "[ 팝빌 ]\n";
  content +=
    "신청하신 #{템플릿코드}에 대한 심사가 완료되어 승인 처리되었습니다.\n";
  content += "해당 템플릿으로 전송 가능합니다.\n\n";
  content += "문의사항 있으시면 파트너센터로 편하게 연락주시기 바랍니다.\n\n";
  content += "팝빌 파트너센터 : 1600-8536\n";
  content += "support@linkhub.co.kr";

  // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
  // ※ 대체문자를 전송하는 경우에는 사전에 등록된 발신번호 입력 필수
  var Sender = "";

  // 대체문자 제목
  // - 메시지 길이(90byte)에 따라 장문(LMS)인 경우에만 적용.
  var altSubject = "대체문자 동보 제목";

  // 대체문자 유형(altSendType)이 "A"일 경우, 대체문자로 전송할 내용 (최대 2000byte)
  // └ 팝빌이 메시지 길이에 따라 단문(90byte 이하) 또는 장문(90byte 초과)으로 전송처리
  var altContent = "알림톡 동보 대체 문자";

  // 대체문자 유형 (null , "C" , "A" 중 택 1)
  // null = 미전송, C = 알림톡과 동일 내용 전송 , A = 대체문자 내용(altContent)에 입력한 내용 전송
  var altSendType = "C";

  // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
  var sndDT = "";

  // [배열] 알림톡 전송정보 (최대 1000개)
  var msgs = [
    {
      rcv: "", //수신번호
      rcvnm: "popbill", //수신자명
    },
    {
      rcv: "",
      rcvnm: "linkhub",
    },
  ];

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  // 전송요청번호
  // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
  // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
  var requestNum = "";

  // 알림톡 버튼정보를 템플릿 신청시 기재한 버튼정보와 동일하게 전송하는 경우 btns를 null 처리.
  var btns = null;

  // 알림톡 버튼 URL에 #{템플릿변수}를 기재한경우 템플릿변수 영역을 변경하여 버튼정보 구성
  // var btns = [
  //     {
  //         n: "템플릿 안내",               //버튼명
  //         t: "WL",                      //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
  //         u1: "https://www.popbill.com", //[앱링크-iOS, 웹링크-Mobile]
  //         u2: "http://www.popbill.com"  //[앱링크-Android, 웹링크-PC URL]
  //     }
  // ];

  kakaoService.sendATS_same(
    testCorpNum,
    templateCode,
    Sender,
    content,
    altSubject,
    altContent,
    altSendType,
    sndDT,
    msgs,
    UserID,
    requestNum,
    btns,
    function (receiptNum) {
      res.render("Kakao/receiptNum", {
        path: req.path,
        receiptNum: receiptNum,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 텍스트로 구성된 1건의 친구톡 전송을 팝빌에 접수합니다.
 * - 친구톡의 경우 야간 전송은 제한됩니다. (20:00 ~ 익일 08:00)
 * - 전송실패시 사전에 지정한 변수 "altSendType" 값으로 대체문자를 전송할 수 있고, 이 경우 문자(SMS/LMS) 요금이 과금됩니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/send#SendFTSOne
 */
router.get("/sendFTS_one", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌에 등록된 카카오톡 채널 아이디
  var plusFriendID = "@팝빌";

  // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
  // ※ 대체문자를 전송하는 경우에는 사전에 등록된 발신번호 입력 필수
  var Sender = "";

  // 친구톡 내용 (최대 1000자)
  var content = "친구톡 내용.";

  // 대체문자 제목
  // - 메시지 길이(90byte)에 따라 장문(LMS)인 경우에만 적용.
  var altSubject = "친구톡 대체문자 제목";

  // 대체문자 유형(altSendType)이 "A"일 경우, 대체문자로 전송할 내용 (최대 2000byte)
  // └ 팝빌이 메시지 길이에 따라 단문(90byte 이하) 또는 장문(90byte 초과)으로 전송처리
  var altContent =
    "친구톡 대체 문자입니다.\n\n" +
    "altSendType을 A로 지정하게 될 경우 해당 내용의 문자가 전송됩니다.\n" +
    "altSendType을 C로 지정하게 되면 content에 작성했던 내용 그대로 전송됩니다.\n" +
    "대체문자를 전송하고 싶지 않을 경우에는 null 을 입력해주세요.";

  // 대체문자 유형 (null , "C" , "A" 중 택 1)
  // null = 미전송, C = 알림톡과 동일 내용 전송 , A = 대체문자 내용(altContent)에 입력한 내용 전송
  var altSendType = "A";

  // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
  var sndDT = "";

  // 수신번호
  var receiver = "";

  // 수신자 이름
  var receiverName = "partner";

  // 광고성 메시지 여부 ( true , false 중 택 1)
  // └ true = 광고 , false = 일반
  // - 미입력 시 기본값 false 처리
  var adsYN = false;

  // [배열] 버튼 목록 (최대 5개)
  var btns = [
    {
      n: "팝빌 바로가기", //버튼명
      t: "WL", //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
      u1: "http://www.popbill.com", //[앱링크-iOS, 웹링크-Mobile]
      u2: "http://www.popbill.com", //[앱링크-Android, 웹링크-PC URL]
    },
  ];

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  // 전송요청번호
  // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
  // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
  var requestNum = "";

  kakaoService.sendFTS_one(
    testCorpNum,
    plusFriendID,
    Sender,
    content,
    altSubject,
    altContent,
    altSendType,
    sndDT,
    receiver,
    receiverName,
    adsYN,
    btns,
    UserID,
    requestNum,
    function (receiptNum) {
      res.render("Kakao/receiptNum", {
        path: req.path,
        receiptNum: receiptNum,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 텍스트로 구성된 다수건의 친구톡 전송을 팝빌에 접수하며, 수신자 별로 개별 내용을 전송합니다. (최대 1,000건)
 * - 친구톡의 경우 야간 전송은 제한됩니다. (20:00 ~ 익일 08:00)
 * - 전송실패시 사전에 지정한 변수 "altSendType" 값으로 대체문자를 전송할 수 있고, 이 경우 문자(SMS/LMS) 요금이 과금됩니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/send#SendFTSMulti
 */
router.get("/sendFTS_multi", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌에 등록된 카카오톡 채널 아이디
  var plusFriendID = "@팝빌";

  // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
  // ※ 대체문자를 전송하는 경우에는 사전에 등록된 발신번호 입력 필수
  var Sender = "";

  // 대체문자 유형 (null , "C" , "A" 중 택 1)
  // null = 미전송, C = 친구톡과 동일 내용 전송 , A = 대체문자 내용(altContent)에 입력한 내용 전송
  var altSendType = "A";

  // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
  var sndDT = "";

  // 광고성 메시지 여부 ( true , false 중 택 1)
  // └ true = 광고 , false = 일반
  // - 미입력 시 기본값 false 처리
  var adsYN = false;

  // [배열] 친구톡 전송정보 (최대 1000개)
  var msgs = [];
  msgs.push({
    rcv: "", //수신번호
    rcvnm: "popbill", //수신자명
    msg: "테스트 템플릿 입니다.", //친구톡 내용
    altsjt: "친구톡 대체 제목", // 대체문자 제목
    altmsg: "친구톡 대체 문자_0", //대체문자 내용
    interOPRefKey: "20220629-01", // 파트너 지정키, 수신자 구별용 메모
  });
  msgs.push({
    rcv: "",
    rcvnm: "linkhub",
    msg: "테스트 템플릿 입니다1",
    altmsg: "친구톡 대체 문자_1",
    interOPRefKey: "20220629-01", // 파트너 지정키, 수신자 구별용 메모
    btns: [
      //수신자별 개별 버튼내용 전송시
      {
        n: "템플릿 안내", //버튼명
        t: "WL", //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
        u1: "https://www.popbill.com", //[앱링크-iOS, 웹링크-Mobile]
        u2: "http://www.popbill.com", //[앱링크-Android, 웹링크-PC URL]
      },
    ],
  });

  // [배열] 버튼 목록 (최대 5개)
  // 버튼 전송 하지 않는 경우 null처리
  // 수신자별 개별버튼내용 전송하는 경우 null 처리
  var btns = null;
  // btns = [
  //     {
  //         n: "팝빌 바로가기",              //버튼명
  //         t: "WL",                      //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
  //         u1: "http://www.popbill.com", //[앱링크-iOS, 웹링크-Mobile]
  //         u2: "http://www.popbill.com"  //[앱링크-Android, 웹링크-PC URL]
  //     }
  // ];

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  // 전송요청번호
  // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
  // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
  var requestNum = "";

  kakaoService.sendFTS_multi(
    testCorpNum,
    plusFriendID,
    Sender,
    altSendType,
    sndDT,
    adsYN,
    msgs,
    btns,
    UserID,
    requestNum,
    function (receiptNum) {
      res.render("Kakao/receiptNum", {
        path: req.path,
        receiptNum: receiptNum,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 텍스트로 구성된 다수건의 친구톡 전송을 팝빌에 접수하며, 모든 수신자에게 동일 내용을 전송합니다. (최대 1,000건)
 * - 친구톡의 경우 야간 전송은 제한됩니다. (20:00 ~ 익일 08:00)
 * - 전송실패시 사전에 지정한 변수 "altSendType" 값으로 대체문자를 전송할 수 있고, 이 경우 문자(SMS/LMS) 요금이 과금됩니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/send#SendFTSSame
 */
router.get("/sendFTS_same", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌에 등록된 카카오톡 채널 아이디
  var plusFriendID = "@팝빌";

  // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
  // ※ 대체문자를 전송하는 경우에는 사전에 등록된 발신번호 입력 필수
  var Sender = "";

  // 친구톡 내용 (최대 1000자)
  var content = "친구톡 내용.";

  // 대체문자 제목
  // - 메시지 길이(90byte)에 따라 장문(LMS)인 경우에만 적용.
  var altSubject = "친구톡 대체문자 제목";

  // 대체문자 유형(altSendType)이 "A"일 경우, 대체문자로 전송할 내용 (최대 2000byte)
  // └ 팝빌이 메시지 길이에 따라 단문(90byte 이하) 또는 장문(90byte 초과)으로 전송처리
  var altContent =
    "친구톡 대체 문자입니다.\n\n" +
    "altSendType을 A로 지정하게 될 경우 해당 내용의 문자가 전송됩니다.\n" +
    "altSendType을 C로 지정하게 되면 content에 작성했던 내용 그대로 전송됩니다.\n" +
    "대체문자를 전송하고 싶지 않을 경우에는 null 을 입력해주세요.";

  // 대체문자 유형 (null , "C" , "A" 중 택 1)
  // null = 미전송, C = 친구톡과 동일 내용 전송 , A = 대체문자 내용(altContent)에 입력한 내용 전송
  var altSendType = "A";

  // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
  var sndDT = "";

  // 광고팩스 전송여부 , true / false 중 택 1
  // └ true = 광고 , false = 일반
  // └ 미입력 시 기본값 false 처리
  var adsYN = false;

  // [배열] 친구톡 전송정보 (최대 1000개)
  var msgs = [
    {
      rcv: "", //수신번호
      rcvnm: "popbill", //수신자명
    },
    {
      rcv: "",
      rcvnm: "linkhub",
    },
  ];

  // [배열] 버튼 목록 (최대 5개)
  var btns = [
    {
      n: "팝빌 바로가기", //버튼명
      t: "WL", //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
      u1: "http://www.popbill.com", //[앱링크-iOS, 웹링크-Mobile]
      u2: "http://www.popbill.com", //[앱링크-Android, 웹링크-PC URL]
    },
  ];

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  // 전송요청번호
  // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
  // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
  var requestNum = "";

  kakaoService.sendFTS_same(
    testCorpNum,
    plusFriendID,
    Sender,
    content,
    altSubject,
    altContent,
    altSendType,
    sndDT,
    adsYN,
    msgs,
    btns,
    UserID,
    requestNum,
    function (receiptNum) {
      res.render("Kakao/receiptNum", {
        path: req.path,
        receiptNum: receiptNum,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 이미지가 첨부된 1건의 친구톡 전송을 팝빌에 접수합니다.
 * - 친구톡의 경우 야간 전송은 제한됩니다. (20:00 ~ 익일 08:00)
 * - 전송실패시 사전에 지정한 변수 "altSendType" 값으로 대체문자를 전송할 수 있고, 이 경우 문자(SMS/LMS) 요금이 과금됩니다.
 * - 대체문자의 경우, 포토문자(MMS) 형식은 지원하고 있지 않습니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/send#SendFMSOne
 */
router.get("/sendFMS_one", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌에 등록된 카카오톡 채널 아이디
  var plusFriendID = "@팝빌";

  // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
  // ※ 대체문자를 전송하는 경우에는 사전에 등록된 발신번호 입력 필수
  var Sender = "";

  // 친구톡 내용 (최대 400자)
  var content = "친구톡 내용.";

  // 대체문자 제목
  // - 메시지 길이(90byte)에 따라 장문(LMS)인 경우에만 적용.
  var altSubject = "친구톡 대체문자 제목";

  // 대체문자 유형(altSendType)이 "A"일 경우, 대체문자로 전송할 내용 (최대 2000byte)
  // └ 팝빌이 메시지 길이에 따라 단문(90byte 이하) 또는 장문(90byte 초과)으로 전송처리
  var altContent =
    "친구톡 대체 문자입니다.\n\n" +
    "altSendType을 A로 지정하게 될 경우 해당 내용의 문자가 전송됩니다.\n" +
    "altSendType을 C로 지정하게 되면 content에 작성했던 내용 그대로 전송됩니다.\n" +
    "대체문자를 전송하고 싶지 않을 경우에는 null 을 입력해주세요.";

  // 대체문자 유형 (null , "C" , "A" 중 택 1)
  // null = 미전송, C = 친구톡과 동일 내용 전송 , A = 대체문자 내용(altContent)에 입력한 내용 전송
  var altSendType = "A";

  // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
  var sndDT = "";

  // 수신번호
  var receiver = "";

  // 수신자 이름
  var receiverName = "partner";

  // 광고팩스 전송여부 , true / false 중 택 1
  // └ true = 광고 , false = 일반
  // └ 미입력 시 기본값 false 처리
  var adsYN = false;

  // 이미지 링크 URL
  // └ 수신자가 친구톡 상단 이미지 클릭시 호출되는 URL
  // - 미입력시 첨부된 이미지를 링크 기능 없이 표시
  var imageURL = "http://www.linkhub.co.kr";

  // 첨부이미지 파일 경로
  // - 이미지 파일 규격: 전송 포맷 – JPG 파일 (.jpg, .jpeg), 용량 – 최대 500 Kbyte, 크기 – 가로 500px 이상, 가로 기준으로 세로 0.5~1.3배 비율 가능
  var filePath = ["./fmsimage.jpg"];

  // [배열] 버튼 목록 (최대 5개)
  var btns = [
    {
      n: "팝빌 바로가기", //버튼명
      t: "WL", //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
      u1: "http://www.popbill.com", //[앱링크-iOS, 웹링크-Mobile]
      u2: "http://www.popbill.com", //[앱링크-Android, 웹링크-PC URL]
    },
  ];

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  // 전송요청번호
  // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
  // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
  var requestNum = "";

  kakaoService.sendFMS_one(
    testCorpNum,
    plusFriendID,
    Sender,
    content,
    altSubject,
    altContent,
    altSendType,
    sndDT,
    receiver,
    receiverName,
    adsYN,
    imageURL,
    filePath,
    btns,
    UserID,
    requestNum,
    function (receiptNum) {
      res.render("Kakao/receiptNum", {
        path: req.path,
        receiptNum: receiptNum,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 이미지가 첨부된 다수건의 친구톡 전송을 팝빌에 접수하며, 수신자 별로 개별 내용을 전송합니다. (최대 1,000건)
 * - 친구톡의 경우 야간 전송은 제한됩니다. (20:00 ~ 익일 08:00)
 * - 전송실패시 사전에 지정한 변수 "altSendType" 값으로 대체문자를 전송할 수 있고, 이 경우 문자(SMS/LMS) 요금이 과금됩니다.
 * - 대체문자의 경우, 포토문자(MMS) 형식은 지원하고 있지 않습니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/send#SendFMSMulti
 */
router.get("/sendFMS_multi", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌에 등록된 카카오톡 채널 아이디
  var plusFriendID = "@팝빌";

  // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
  // ※ 대체문자를 전송하는 경우에는 사전에 등록된 발신번호 입력 필수
  var Sender = "";

  // 대체문자 유형 (null , "C" , "A" 중 택 1)
  // null = 미전송, C = 친구톡과 동일 내용 전송 , A = 대체문자 내용(altContent)에 입력한 내용 전송
  var altSendType = "A";

  // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
  var sndDT = "";

  // 광고팩스 전송여부 , true / false 중 택 1
  // └ true = 광고 , false = 일반
  // └ 미입력 시 기본값 false 처리
  var adsYN = false;

  // 이미지 링크 URL
  // └ 수신자가 친구톡 상단 이미지 클릭시 호출되는 URL
  // - 미입력시 첨부된 이미지를 링크 기능 없이 표시
  var imageURL = "http://www.linkhub.co.kr";

  // 첨부이미지 파일 경로
  // - 이미지 파일 규격: 전송 포맷 – JPG 파일 (.jpg, .jpeg), 용량 – 최대 500 Kbyte, 크기 – 가로 500px 이상, 가로 기준으로 세로 0.5~1.3배 비율 가능
  var filePath = ["./fmsimage.jpg"];

  // [배열] 친구톡 전송정보 (최대 1000개)
  var msgs = [];
  msgs.push({
    rcv: "", //수신번호
    rcvnm: "popbill", //수신자명
    msg: "친구톡 이미지 입니다_0", //친구톡 내용 (최대 400자)
    altsjt: "친구톡 이미지 대체문자제목0", // 대체문자 제목
    altmsg: "친구톡 대체 문자_0", //대체문자 내용 (최대 2000byte)
    interOPRefKey: "20220629-01", // 파트너 지정키, 수신자 구별용 메모
  });
  msgs.push({
    rcv: "",
    rcvnm: "linkhub",
    msg: "친구톡 이미지 입니다_1",
    altsjt: "친구톡 이미지 대체문자제목1",
    altmsg: "친구톡 대체 문자_1",
    interOPRefKey: "20220629-02", // 파트너 지정키, 수신자 구별용 메모
    btns: [
      //수신자별 개별 버튼내용 전송시
      {
        n: "템플릿 안내", //버튼명
        t: "WL", //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
        u1: "https://www.popbill.com", //[앱링크-iOS, 웹링크-Mobile]
        u2: "http://www.popbill.com", //[앱링크-Android, 웹링크-PC URL]
      },
    ],
  });

  // [배열] 버튼 목록 (최대 5개)
  // 버튼 전송 하지 않는 경우 null처리
  // 수신자별 개별버튼내용 전송하는 경우 null 처리
  var btns = null;
  // btns = [
  //     {
  //         n: "팝빌 바로가기",              //버튼명
  //         t: "WL",                      //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
  //         u1: "http://www.popbill.com", //[앱링크-iOS, 웹링크-Mobile]
  //         u2: "http://www.popbill.com"  //[앱링크-Android, 웹링크-PC URL]
  //     }
  // ];

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  // 전송요청번호
  // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
  // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
  var requestNum = "";

  kakaoService.sendFMS_multi(
    testCorpNum,
    plusFriendID,
    Sender,
    altSendType,
    sndDT,
    adsYN,
    imageURL,
    filePath,
    msgs,
    btns,
    UserID,
    requestNum,
    function (receiptNum) {
      res.render("Kakao/receiptNum", {
        path: req.path,
        receiptNum: receiptNum,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 이미지가 첨부된 다수건의 친구톡 전송을 팝빌에 접수하며, 모든 수신자에게 동일 내용을 전송합니다. (최대 1,000건)
 * - 친구톡의 경우 야간 전송은 제한됩니다. (20:00 ~ 익일 08:00)
 * - 전송실패시 사전에 지정한 변수 "altSendType" 값으로 대체문자를 전송할 수 있고, 이 경우 문자(SMS/LMS) 요금이 과금됩니다.
 * - 대체문자의 경우, 포토문자(MMS) 형식은 지원하고 있지 않습니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/send#SendFMSSame
 */
router.get("/sendFMS_same", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌에 등록된 카카오톡 채널 아이디
  var plusFriendID = "@팝빌";

  // 발신번호 (팝빌에 등록된 발신번호만 이용가능)
  // ※ 대체문자를 전송하는 경우에는 사전에 등록된 발신번호 입력 필수
  var Sender = "";

  // 친구톡 내용 (최대 400자)
  var content = "친구톡 내용.";

  // 대체문자 제목
  // - 메시지 길이(90byte)에 따라 장문(LMS)인 경우에만 적용.
  var altSubject = "친구톡 대체문자 제목";

  // 대체문자 유형(altSendType)이 "A"일 경우, 대체문자로 전송할 내용 (최대 2000byte)
  // └ 팝빌이 메시지 길이에 따라 단문(90byte 이하) 또는 장문(90byte 초과)으로 전송처리
  var altContent =
    "친구톡 대체 문자입니다.\n\n" +
    "altSendType을 A로 지정하게 될 경우 해당 내용의 문자가 전송됩니다.\n" +
    "altSendType을 C로 지정하게 되면 content에 작성했던 내용 그대로 전송됩니다.\n" +
    "대체문자를 전송하고 싶지 않을 경우에는 null 을 입력해주세요.";

  // 대체문자 유형 (null , "C" , "A" 중 택 1)
  // null = 미전송, C = 친구톡과 동일 내용 전송 , A = 대체문자 내용(altContent)에 입력한 내용 전송
  var altSendType = "A";

  // 예약전송일시(yyyyMMddHHmmss), null인 경우 즉시전송
  var sndDT = "";

  // 광고팩스 전송여부 , true / false 중 택 1
  // └ true = 광고 , false = 일반
  // └ 미입력 시 기본값 false 처리
  var adsYN = false;

  // 이미지 링크 URL
  // └ 수신자가 친구톡 상단 이미지 클릭시 호출되는 URL
  // - 미입력시 첨부된 이미지를 링크 기능 없이 표시
  var imageURL = "http://www.linkhub.co.kr";

  // 첨부이미지 파일 경로
  // - 이미지 파일 규격: 전송 포맷 – JPG 파일 (.jpg, .jpeg), 용량 – 최대 500 Kbyte, 크기 – 가로 500px 이상, 가로 기준으로 세로 0.5~1.3배 비율 가능
  var filePath = ["./fmsimage.jpg"];

  // [배열] 친구톡 전송정보 (최대 1000개)
  var msgs = [
    {
      rcv: "", //수신번호
      rcvnm: "popbill", //수신자명
    },
    {
      rcv: "",
      rcvnm: "linkhub",
    },
  ];

  // [배열] 버튼 목록 (최대 5개)
  var btns = [
    {
      n: "팝빌 바로가기", //버튼명
      t: "WL", //버튼유형 [WL-웹링크, AL-앱링크, MD-메시지전달, BK-봇키워드]
      u1: "http://www.popbill.com", //[앱링크-iOS, 웹링크-Mobile]
      u2: "http://www.popbill.com", //[앱링크-Android, 웹링크-PC URL]
    },
  ];

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  // 전송요청번호
  // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
  // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
  var requestNum = "";

  kakaoService.sendFMS_same(
    testCorpNum,
    plusFriendID,
    Sender,
    content,
    altSubject,
    altContent,
    altSendType,
    sndDT,
    adsYN,
    imageURL,
    filePath,
    msgs,
    btns,
    UserID,
    requestNum,
    function (receiptNum) {
      res.render("Kakao/receiptNum", {
        path: req.path,
        receiptNum: receiptNum,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 팝빌에서 반환받은 접수번호를 통해 예약접수된 카카오톡을 전송 취소합니다. (예약시간 10분 전까지 가능)
 * - https://developers.popbill.com/reference/kakaotalk/node/api/send#CancelReserve
 */
router.get("/cancelReserve", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 예약 알림톡/친구톡 전송 접수번호
  var receiptNum = "021010912071500001";

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  kakaoService.cancelReserve(
    testCorpNum,
    receiptNum,
    function (response) {
      res.render("response", {
        path: req.path,
        code: response.code,
        message: response.message,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 파트너가 할당한 전송요청 번호를 통해 예약접수된 카카오톡을 전송 취소합니다. (예약시간 10분 전까지 가능)
 * - https://developers.popbill.com/reference/kakaotalk/node/api/send#CancelReserveRN
 */
router.get("/cancelReserveRN", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 예약 알림톡/친구톡 전송 요청번호
  var requestNum = "";

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  kakaoService.cancelReserveRN(
    testCorpNum,
    requestNum,
    function (response) {
      res.render("response", {
        path: req.path,
        code: response.code,
        message: response.message,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 팝빌에서 반환받은 접수번호를 통해 알림톡/친구톡 전송상태 및 결과를 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/info#GetMessages
 */
router.get("/getMessages", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 카카오톡 접수번호
  var receiptNum = "022070114430900001";

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  kakaoService.getMessages(
    testCorpNum,
    receiptNum,
    function (response) {
      res.render("Kakao/getMessages", {
        path: req.path,
        result: response,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 파트너가 할당한 전송요청 번호를 통해 알림톡/친구톡 전송상태 및 결과를 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/info#GetMessagesRN
 */
router.get("/getMessagesRN", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 카카오톡 요청번호
  var requestNum = "";

  // 팝빌회원 아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  kakaoService.getMessagesRN(
    testCorpNum,
    requestNum,
    function (response) {
      res.render("Kakao/getMessages", {
        path: req.path,
        result: response,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 검색조건에 해당하는 카카오톡 전송내역을 조회합니다. (조회기간 단위 : 최대 2개월)
 * 카카오톡 접수일시로부터 6개월 이내 접수건만 조회할 수 있습니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/info#Search
 */
router.get("/search", function (req, res, next) {
  // 팝빌회원 사업자 번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 시작일자, 표시형식 (yyyyMMdd)
  var sDate = "20220601";

  // 종료일자, 표시형식 (yyyyMMdd)
  var eDate = "20220629";

  // 전송상태 배열 ("0" , "1" , "2" , "3" , "4" , "5" 중 선택, 다중 선택 가능)
  // └ 0 = 전송대기 , 1 = 전송중 , 2 = 전송성공 , 3 = 대체문자 전송 , 4 = 전송실패 , 5 = 전송취소
  // - 미입력 시 전체조회
  var state = [0, 1, 2, 3, 4, 5];

  // 검색대상 배열 ("ATS", "FTS", "FMS" 중 선택, 다중 선택 가능)
  // └ ATS = 알림톡 , FTS = 친구톡(텍스트) , FMS = 친구톡(이미지)
  // - 미입력 시 전체조회
  var item = ["ATS", "FTS", "FMS"];

  // 전송유형별 조회 (null , "0" , "1" 중 택 1)
  // └ null = 전체 , 0 = 즉시전송건 , 1 = 예약전송건
  // - 미입력 시 전체조회
  var reserveYN = "";

  // 사용자권한별 조회 (true / false 중 택 1)
  // └ false = 접수한 카카오톡 전체 조회 (관리자권한)
  // └ true = 해당 담당자 계정으로 접수한 카카오톡만 조회 (개인권한)
  // - 미입력시 기본값 false 처리
  var senderYN = true;

  // 페이지 번호, 기본값 1
  var page = 1;

  // 페이지당 검색개수, 기본값 500, 최대값 1000
  var perPage = 10;

  // 정렬방향 ( D-내림차순 / A-오름차순 ) 기본값 D
  var order = "D";

  // 조회하고자 하는 수신자명
  // - 미입력시 전체조회
  var QString = "";

  // 팝빌 회원아이디
  // 팝빌 회원 아이디
  var UserID = "testkorea";

  kakaoService.search(
    testCorpNum,
    sDate,
    eDate,
    state,
    item,
    reserveYN,
    senderYN,
    page,
    perPage,
    order,
    QString,
    UserID,
    function (response) {
      res.render("Kakao/search", {
        path: req.path,
        result: response,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 팝빌 사이트와 동일한 카카오톡 전송내역을 확인하는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/info#GetSentListURL
 */
router.get("/getSentListURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  kakaoService.getSentListURL(
    testCorpNum,
    testUserID,
    function (url) {
      res.render("result", {
        path: req.path,
        result: url,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 연동회원의 잔여포인트를 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#GetBalance
 */
router.get("/getBalance", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  kakaoService.getBalance(
    testCorpNum,
    function (remainPoint) {
      res.render("result", {
        path: req.path,
        result: remainPoint,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 연동회원 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#GetChargeURL
 */
router.get("/getChargeURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  kakaoService.getChargeURL(
    testCorpNum,
    testUserID,
    function (url) {
      res.render("result", {
        path: req.path,
        result: url,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 연동회원 포인트 결제내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#GetPaymentURL
 */
router.get("/getPaymentURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  kakaoService.getPaymentURL(
    testCorpNum,
    testUserID,
    function (url) {
      res.render("result", {
        path: req.path,
        result: url,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 연동회원 포인트 사용내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#GetUseHistoryURL
 */
router.get("/getUseHistoryURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  kakaoService.getUseHistoryURL(
    testCorpNum,
    testUserID,
    function (url) {
      res.render("result", {
        path: req.path,
        result: url,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 파트너의 잔여포인트를 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#GetPartnerBalance
 */
router.get("/getPartnerBalance", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  kakaoService.getPartnerBalance(
    testCorpNum,
    function (remainPoint) {
      res.render("result", {
        path: req.path,
        result: remainPoint,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 파트너 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#GetPartnerURL
 */
router.get("/getPartnerURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // CHRG(파트너 포인트충전)
  var TOGO = "CHRG";

  kakaoService.getPartnerURL(
    testCorpNum,
    TOGO,
    function (url) {
      res.render("result", {
        path: req.path,
        result: url,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 카카오톡(알림톡) 전송시 과금되는 포인트 단가를 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#GetUnitCost
 */
router.get("/getUnitCost", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";
  // 전송유형 ( ATS-알림톡 / FTS-친구톡텍스트 / FMS-친구톡이미지 )
  var kakaoType = popbill.KakaoType.ATS;

  kakaoService.getUnitCost(
    testCorpNum,
    kakaoType,
    function (unitCost) {
      res.render("result", {
        path: req.path,
        result: unitCost,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 팝빌 카카오톡 API 서비스 과금정보를 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#GetChargeInfo
 */
router.get("/getChargeInfo", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 전송유형 ( ATS-알림톡 / FTS-친구톡텍스트 / FMS-친구톡이미지 )
  var kakaoType = popbill.KakaoType.ATS;

  kakaoService.getChargeInfo(
    testCorpNum,
    kakaoType,
    function (result) {
      res.render("Base/getChargeInfo", {
        path: req.path,
        result: result,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 사업자번호를 조회하여 연동회원 가입여부를 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/member#CheckIsMember
 */
router.get("/checkIsMember", function (req, res, next) {
  //조회할 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  kakaoService.checkIsMember(
    testCorpNum,
    function (result) {
      res.render("response", {
        path: req.path,
        code: result.code,
        message: result.message,
      });
    },
    function (Error) {
      res.render("response", {
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 사용하고자 하는 아이디의 중복여부를 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/member#CheckID
 */
router.get("/checkID", function (req, res, next) {
  // 조회할 아이디
  var testID = "testkorea";

  kakaoService.checkID(
    testID,
    function (result) {
      res.render("response", {
        path: req.path,
        code: result.code,
        message: result.message,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 사용자를 연동회원으로 가입처리합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/member#JoinMember
 */
router.get("/joinMember", function (req, res, next) {
  // 회원정보
  var joinInfo = {
    // 회원 아이디 (6자 이상 50자 미만)
    ID: "userid",

    // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
    Password: "asdf8536!@#",

    // 링크아이디
    LinkID: kakaoService._config.LinkID,

    // 사업자번호, "-" 제외 10자리
    CorpNum: "1234567890",

    // 대표자명 (최대 100자)
    CEOName: "대표자성명",

    // 상호 (최대 200자)
    CorpName: "테스트상호",

    // 주소 (최대 300자)
    Addr: "주소",

    // 업태 (최대 100자)
    BizType: "업태",

    // 종목 (최대 100자)
    BizClass: "업종",

    // 담당자 성명 (최대 100자)
    ContactName: "담당자 성명",

    // 담당자 이메일 (최대 20자)
    ContactEmail: "",

    // 담당자 연락처 (최대 20자)
    ContactTEL: "",
  };

  kakaoService.joinMember(
    joinInfo,
    function (result) {
      res.render("response", {
        path: req.path,
        code: result.code,
        message: result.message,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 팝빌 사이트에 로그인 상태로 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/member#GetAccessURL
 */
router.get("/getAccessURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  kakaoService.getAccessURL(
    testCorpNum,
    testUserID,
    function (url) {
      res.render("result", {
        path: req.path,
        result: url,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 연동회원의 회사정보를 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/member#GetCorpInfo
 */
router.get("/getCorpInfo", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  kakaoService.getCorpInfo(
    testCorpNum,
    function (result) {
      res.render("Base/getCorpInfo", {
        path: req.path,
        result: result,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 연동회원의 회사정보를 수정합니다
 * - https://developers.popbill.com/reference/kakaotalk/node/api/member#UpdateCorpInfo
 */
router.get("/updateCorpInfo", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 회사정보
  var corpInfo = {
    // 대표자명 (최대 100자)
    ceoname: "대표자성명_nodejs",

    // 상호 (최대 200자)
    corpName: "업체명_nodejs",

    // 주소 (최대 300자)
    addr: "주소_nodejs",

    // 업태 (최대 100자)
    bizType: "업태_nodejs",

    // 종목 (최대 100자)
    bizClass: "종목_nodejs",
  };

  kakaoService.updateCorpInfo(
    testCorpNum,
    corpInfo,
    function (result) {
      res.render("response", {
        path: req.path,
        code: result.code,
        message: result.message,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 연동회원 사업자번호에 담당자(팝빌 로그인 계정)를 추가합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/member#RegistContact
 */
router.get("/registContact", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 담당자 정보
  var contactInfo = {
    // 아이디 (6자 이상 50자 미만)
    id: "testkorea03033",

    // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
    Password: "asdf8536!@#",

    // 담당자명 (최대 100자)
    personName: "담당자명0309",

    // 연락처 (최대 20자)
    tel: "010-1234-1234",

    // 이메일 (최대 100자)
    email: "test@email.com",

    // 담당자 권한, 1 : 개인권한, 2 : 읽기권한, 3 : 회사권한
    searchRole: 3,
  };

  kakaoService.registContact(
    testCorpNum,
    contactInfo,
    function (result) {
      res.render("response", {
        path: req.path,
        code: result.code,
        message: result.message,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보을 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/member#GetContactInfo
 */
router.get("/getContactInfo", function (req, res, next) {
  // 팝빌회원 사업자번호
  var testCorpNum = "1234567890";

  // 확인할 담당자 아이디
  var contactID = "checkContactID";

  kakaoService.getContactInfo(
    testCorpNum,
    contactID,
    function (result) {
      res.render("Base/getContactInfo", {
        path: req.path,
        result: result,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 목록을 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/member#ListContact
 */
router.get("/listContact", function (req, res, next) {
  // 조회할 아이디
  var testCorpNum = "1234567890";

  kakaoService.listContact(
    testCorpNum,
    function (result) {
      res.render("Base/listContact", {
        path: req.path,
        result: result,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보를 수정합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/member#UpdateContact
 */
router.get("/updateContact", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  // 담당자 정보 항목
  var contactInfo = {
    // 담당자 아이디
    id: testUserID,

    // 담당자명 (최대 100자)
    personName: "담당자명0309",

    // 연락처 (최대 20자)
    tel: "010-1234-1234",

    // 이메일 (최대 100자)
    email: "test@email.com",

    // 담당자 권한, 1 : 개인권한, 2 : 읽기권한, 3 : 회사권한
    searchRole: 3,
  };

  kakaoService.updateContact(
    testCorpNum,
    testUserID,
    contactInfo,
    function (result) {
      res.render("response", {
        path: req.path,
        code: result.code,
        message: result.message,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

// TODO : API 설명 주석 추가
router.get("/cancelReservebyRCV", function (req, res, next) {
  var CorpNum = "1234567890";
  var receiptNum = "";
  var receiveNum = "";
  var UserID = "testkorea";

  kakaoService.cancelReservebyRCV(
    CorpNum,
    receiptNum,
    receiveNum,
    UserID,
    function (result) {
      res.render("response", { path: req.path, result: result });
    },
    function (error) {
      res.render("response", {
        path: req.path,
        code: error.code,
        message: error.message,
      });
    }
  );
});

// TODO : API 설명 주석 추가
router.get("/cancelReserveRNbyRCV", function (req, res, next) {
  var CorpNum = "1234567890";
  var requestNum = "";
  var receiveNum = "";
  var UserID = "testkorea";

  kakaoService.cancelReserveRNbyRCV(
    CorpNum,
    requestNum,
    receiveNum,
    UserID,
    function (result) {
      res.render("response", {
        path: req.path,
        result: result,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/**
 * 연동회원 포인트 충전을 위해 무통장입금을 신청합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#PaymentRequest
 */
router.get("/paymentRequest", function (req, res, next) {
  // 팝빌회원 사업자 번호
  var CorpNum = "1234567890";
  // 담당자명
  var SettlerName = "";
  // 담당자 이메일
  var SettlerEmail = "";
  // 담당자 휴대폰
  var NotifyHP = "";
  // 입금자명
  var PaymentName = "";
  // 결제금액
  var SettleCost = "";

  // 입금신청 객체 정보
  var PaymentForm = {
    settlerName: SettlerName,
    settlerEmail: SettlerEmail,
    notifyHP: NotifyHP,
    paymentName: PaymentName,
    settleCost: SettleCost,
  };
  // 팝빌회원 아이디
  var UserID = "testkorea";

  kakaoService.paymentRequest(
    CorpNUm,
    PaymentForm,
    UserID,
    function (result) {
      res.render("Base/paymentResponse", {
        path: req.path,
        result: result,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/**
 * 연동회원 포인트 무통장 입금신청내역 1건을 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#GetSettleResult
 */
router.get("/getSettleResult", function (req, res, next) {
  // 팝빌회원 사업자 번호
  var CorpNum = "1234567890";
  // 정산코드 - PaymentRequest 호출시 반환되는 값
  var SettleCode = "";
  // 팝빌회원 아이디
  var UserID = "testkorea";

  kakaoService.getBulkResult(
    CorpNum,
    SettleCode,
    UserID,
    function (result) {
      res.render("Base/paymentHistory", {
        path: req.path,
        result: result,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/**
 * 연동회원의 포인트 결제내역을 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#GetPaymentHistory
 */
router.get("/getPaymentHistory", function (req, res, next) {
  // 팝빌회원 사업자번호 (하이픈 "-" 제외 10자리)
  var CorpNum = "1234567890";
  // 조회 기간의 시작일자 (형식 : yyyyMMdd)
  var SDate = "20230101";
  // 조회 기간의 종료일자 (형식 : yyyyMMdd)
  var EDate = "20230107";
  // 목록 페이지번호 (기본값 1)
  var Page = 1;
  // 페이지당 표시할 목록 개수 (기본값 500, 최대 1,000)
  var PerPage = 500;
  // 팝빌회원 아이디
  var UserID = "testkorea";

  kakaoService.getPaymentHistory(
    CorpNum,
    SDate,
    EDate,
    Page,
    PerPage,
    UserID,
    function (result) {
      res.render("Base/paymentHistoryResult", {
        path: req.path,
        result: result,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/**
 * 연동회원의 포인트 사용내역을 확인합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#GetUseHistory
 */
router.get("/getUseHistory", function (req, res, next) {
  var CorpNum = "1234567890";
  var SDate = "";
  var EDate = "";
  var Page = 1;
  var PerPage = 500;
  var Order = "";
  var UserID = "testkorea";

  kakaoService.getUseHistory(
    CorpNum,
    SDate,
    EDate,
    Page,
    PerPage,
    Order,
    UserID,
    function (result) {
      res.render("Base/useHistoryResult", {
        path: req.path,
        result: result,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/**
 * 연동회원 포인트를 환불 신청합니다.
 * - https://developers.popbill.com/reference/kakaotalk/node/api/point#Refund
 */
router.get("/refund", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var CorpNum = "1234567890";

  // 환불신청 객체정보
  var RefundForm = {
    // 담당자명
    contactName: "환불_담당자",

    // 담당자 연락처
    tel: "010-1234-1234",

    // 환불 신청 포인트
    requestPoint: "1000",

    // 은행명
    accountBank: "국민",

    // 계좌번호
    accountNum: "123123123-123",

    // 예금주명
    accountName: "환불_예금주",

    // 환불 사유
    reason: "환불사유",
  };

  // 팝빌 회원 아이디
  var UserID = "testkorea";

  kakaoService.refund(
    CorpNum,
    RefundForm,
    UserID,
    function (result) {
      res.render("response", {
        path: req.path,
        code: result.code,
        message: result.message,
        refundCode: result.refundCode,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/**
 * 연동회원의 포인트 환불신청내역을 확인합니다.
 * https://developers.popbill.com/reference/kakaotalk/node/api/point#GetRefundHistory
 */
router.get("/getRefundHistory", function (req, res, next) {
  var CorpNum = "1234567890";
  var Page = 1;
  var PerPage = 500;
  var UserID = "testkorea";

  kakaoService.getRefundHistory(
    CorpNum,
    Page,
    PerPage,
    UserID,
    function (result) {
      res.render("Base/RefundHistoryResult", {
        path: req.path,
        result: result,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/**
 * 회원 탈퇴를 합니다.
 * https://developers.popbill.com/reference/kakaotalk/node/api/member#QuitMember
 */
router.get("/quitMember", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var CorpNum = "123456789";

  // 탈퇴 사유
  var QuitReason = "탈퇴 사유";

  // 팝빌 회원 아이디
  var UserID = "testkorea";

  kakaoService.QuitMember(
    CorpNum,
    QuitReason,
    UserID,
    function (result) {
      res.render("response", {
        path: req.path,
        code: result.code,
        message: result.message,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/**
 * 환불 가능한 포인트를 확인합니다. (보너스 포인트는 환불가능포인트에서 제외됩니다.)
 * https://developers.popbill.com/reference/kakaotalk/node/api/point#GetRefundableBalance
 */
router.get("/getRefundableBalance", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var CorpNum = "123456789";

  // 팝빌 회원 아이디
  var UserID = "testkorea";

  kakaoService.GetRefundableBalance(
    CorpNum,
    UserID,
    function (result) {
      res.render("Base/getRefundableBalance", {
        path: req.path,
        refundableBalance: result.refundableBalance,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

/**
 * 환불 신청의 상태를 확인합니다.
 * https://developers.popbill.com/reference/kakaotalk/node/api/point#GetRefundInfo
 */
router.get("/getRefundInfo", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var CorpNum = "123456789";

  // 환불 코드
  var RefundCode = "023040000017";

  // 팝빌 회원 아이디
  var UserID = "testkorea";

  kakaoService.GetRefundInfo(
    CorpNum,
    RefundCode,
    UserID,
    function (result) {
      res.render("Base/getRefundInfo", {
        path: req.path,
        result: result,
      });
    },
    function (Error) {
      res.render("response", {
        path: req.path,
        code: Error.code,
        message: Error.message,
      });
    }
  );
});

module.exports = router;
