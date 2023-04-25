var express = require("express");
var router = express.Router();
var popbill = require("popbill");

/*
 * 예금주조회 API 모듈초기화
 */
var accountCheckService = popbill.AccountCheckService();

/*
 * AccountCheck API Index 목록
 */
router.get("/", function (req, res, next) {
  res.render("AccountCheck/index", {});
});

/*
 * 1건의 예금주성명을 조회합니다.
 * - https://developers.popbill.com/reference/accountcheck/node/api/check#CheckAccountInfo
 */
router.get("/checkAccountInfo", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 기관코드
  var bankCode = "";

  // 계좌번호 (하이픈 "-" 제외 8자리 이상 14자리 이하)
  var accountNumber = "";

  accountCheckService.checkAccountInfo(
    testCorpNum,
    bankCode,
    accountNumber,
    function (returnObj) {
      res.render("AccountCheck/CheckAccountInfo", {
        path: req.path,
        result: returnObj,
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
 * 1건의 예금주실명을 조회합니다.
 * - https://developers.popbill.com/reference/accountcheck/node/api/check#CheckDepositorInfo
 */
router.get("/checkDepositorInfo", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 기관코드
  var bankCode = "";

  // 계좌번호 (하이픈 "-" 제외 8자리 이상 14자리 이하)
  var accountNumber = "";

  // 등록번호 유형 ( P / B 중 택 1 ,  P = 개인, B = 사업자)
  var identityNumType = "P";

  // 등록번호
  // └ 등록번호 유형 값이 "B"인 경우 사업자번호(10 자리) 입력
  // └ 등록번호 유형 값이 "P"인 경우 생년월일(6 자리) 입력 (형식 : YYMMDD)
  // 하이픈 "-" 제외하고 입력
  var identityNum = "";

  accountCheckService.checkDepositorInfo(
    testCorpNum,
    bankCode,
    accountNumber,
    identityNumType,
    identityNum,
    function (returnObj) {
      res.render("AccountCheck/CheckDepositorInfo", {
        path: req.path,
        result: returnObj,
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#GetBalance
 */
router.get("/getBalance", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  accountCheckService.getBalance(
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
 * 팝빌 연동회원 사업자의 포인트 충전 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#GetChargeURL
 */
router.get("/getChargeURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  accountCheckService.getChargeURL(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#GetPaymentURL
 */
router.get("/getPaymentURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  accountCheckService.getPaymentURL(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#GetUseHistoryURL
 */
router.get("/getUseHistoryURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  accountCheckService.getUseHistoryURL(
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
 * 파트너 잔여포인트를 확인합니다.
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#GetPartnerBalance
 */
router.get("/getPartnerBalance", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  accountCheckService.getPartnerBalance(
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
 * 파트너 포인트 충전 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#GetPartnerURL
 */
router.get("/getPartnerURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // CHRG(포인트충전)
  var TOGO = "CHRG";

  accountCheckService.getPartnerURL(
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
 * 예금주조회 단가를 확인합니다.
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#GetUnitCost
 */
router.get("/getUnitCost", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 서비스 유형 ("성명" / "실명" 중 택 1 , 성명 = 예금주성명조회, 실명 = 예금주실명조회)
  var serviceType = "성명";

  accountCheckService.getUnitCost(
    testCorpNum,
    serviceType,
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
 * 팝빌 예금주조회 API 서비스 과금정보를 확인합니다.
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#GetChargeInfo
 */
router.get("/getChargeInfo", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 서비스 유형 ("성명" / "실명" 중 택 1 , 성명 = 예금주성명조회, 실명 = 예금주실명조회)
  var serviceType = "성명";

  // 팝빌회원 아이디
  var userId = "";

  accountCheckService.getChargeInfo(
    testCorpNum,
    serviceType,
    userId,
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/member#CheckIsMember
 */
router.get("/checkIsMember", function (req, res, next) {
  // 조회할 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  accountCheckService.checkIsMember(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/member#CheckID
 */
router.get("/checkID", function (req, res, next) {
  // 조회할 아이디
  var testID = "testkorea";

  accountCheckService.checkID(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/member#JoinMember
 */
router.get("/joinMember", function (req, res, next) {
  // 회원정보
  var joinInfo = {
    // 회원 아이디 (6자 이상 50자 미만)
    ID: "userid",

    // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
    Password: "asdf8536!@#",

    // 링크아이디
    LinkID: accountCheckService._config.LinkID,

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

  accountCheckService.joinMember(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/member#GetAccessURL
 */
router.get("/getAccessURL", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  // 팝빌회원 아이디
  var testUserID = "testkorea";

  accountCheckService.getAccessURL(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/member#GetCorpInfo
 */
router.get("/getCorpInfo", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var testCorpNum = "1234567890";

  accountCheckService.getCorpInfo(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/member#UpdateCorpInfo
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
    addr: "서구 천변좌로_nodejs",

    // 업태 (최대 100자)
    bizType: "업태_nodejs",

    // 종목 (최대 100자)
    bizClass: "종목_nodejs",
  };

  accountCheckService.updateCorpInfo(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/member#RegistContact
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

  accountCheckService.registContact(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/member#GetContactInfo
 */
router.get("/getContactInfo", function (req, res, next) {
  // 팝빌회원 사업자번호
  var testCorpNum = "1234567890";

  // 확인할 담당자 아이디
  var contactID = "checkContactID";

  accountCheckService.getContactInfo(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/member#ListContact
 */
router.get("/listContact", function (req, res, next) {
  // 조회할 아이디
  var testCorpNum = "1234567890";

  accountCheckService.listContact(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/member#UpdateContact
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

  accountCheckService.updateContact(
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

/**
 * 연동회원 포인트 충전을 위해 무통장입금을 신청합니다.
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#PaymentRequest
 */
router.get("/paymentRequest", function (req, res, next) {
  // 팝빌회원 사업자 번호
  var CorpNUm = "";
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
  var UserID = "";

  accountCheckService.paymentRequest(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#GetSettleResult
 */
router.get("/getSettleResult", function (req, res, next) {
  // 팝빌회원 사업자 번호
  var CorpNum = "";
  // 정산코드 - PaymentRequest 호출시 반환되는 값
  var SettleCode = "";
  // 팝빌회원 아이디
  var UserID = "";

  accountCheckService.getBulkResult(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#GetPaymentHistory
 */
router.get("/getPaymentHistory", function (req, res, next) {
  // 팝빌회원 사업자번호 (하이픈 "-" 제외 10자리)
  var CorpNum = "";
  // 조회 기간의 시작일자 (형식 : yyyyMMdd)
  var SDate = "20230101";
  // 조회 기간의 종료일자 (형식 : yyyyMMdd)
  var EDate = "20230107";
  // 목록 페이지번호 (기본값 1)
  var Page = 1;
  // 페이지당 표시할 목록 개수 (기본값 500, 최대 1,000)
  var PerPage = 500;
  // 팝빌회원 아이디
  var UserID = "";

  accountCheckService.getPaymentHistory(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#GetUseHistory
 */
router.get("/getUseHistory", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var CorpNum = "1234567890";

  // 조회 기간의 시작일자 (형식: yyyyMMdd)
  var SDate = "";

  // 조회 기간의 종료일자 (형식: yyyyMMdd)
  var EDate = "";

  // 목록 페이지번호 (기본값 1)
  var Page = 1;

  // 페이지당 표시할 목록 개수 (기본값 500, 최대 1,000)
  var PerPage = 500;

  // 거래일자를 기준으로 하는 목록 정렬 방향 : "D" / "A" 중 택 1
  var Order = "";

  // 팝빌 회원 아이디
  var UserID = "testkorea";

  accountCheckService.getUseHistory(
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
 * - https://developers.popbill.com/reference/accountcheck/node/api/point#Refund
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

  accountCheckService.refund(
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
 * https://developers.popbill.com/reference/accountcheck/node/api/point#GetRefundHistory
 */
router.get("/getRefundHistory", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var CorpNum = "1234567890";

  // 목록 페이지번호
  var Page = 1;

  // 페이지당 검색개수
  var PerPage = 500;

  // 팝빌 회원 아이디
  var UserID = "testkorea";

  accountCheckService.getRefundHistory(
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
 * https://developers.popbill.com/reference/accountcheck/node/api/point#QuitMember
 */
router.get("/quitMember", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var CorpNum = "123456789";

  // 탈퇴 사유
  var QuitReason = "탈퇴 사유";

  // 팝빌 회원 아이디
  var UserID = "testkorea";

  accountCheckService.QuitMember(
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
 * https://developers.popbill.com/reference/accountcheck/node/api/point#GetRefundableBalance
 */
router.get("/getRefundableBalance", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var CorpNum = "123456789";

  // 팝빌 회원 아이디
  var UserID = "testkorea";

  accountCheckService.GetRefundableBalance(
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
 * https://developers.popbill.com/reference/accountcheck/node/api/point#GetRefundInfo
 */
router.get("/getRefundInfo", function (req, res, next) {
  // 팝빌회원 사업자번호, "-" 제외 10자리
  var CorpNum = "123456789";

  // 환불 코드
  var RefundCode = "023040000017";

  // 팝빌 회원 아이디
  var UserID = "testkorea";

  accountCheckService.GetRefundInfo(
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
