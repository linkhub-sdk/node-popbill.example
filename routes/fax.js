var express = require('express');
var router = express.Router();
var popbill = require('popbill');

/**
* 팝빌 서비스 연동환경 초기화
*/
popbill.config({

  // 링크아이디
  LinkID :'TESTER',

  // 비밀키
  SecretKey : 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',

  // 연동환경 설정값, 개발용(true), 상업용(false)
  IsTest : true,

  defaultErrorHandler :  function(Error) {
    console.log('Error Occur : [' + Error.code + '] ' + Error.message);
  }
});


/**
* 팩스 API 서비스 클래스 생성
*/
var faxService = popbill.FaxService();


/**
* Fax API Index 목록
*/
router.get('/', function(req, res, next) {
  res.render('Fax/index', {});
});


/**
* 해당 사업자의 파트너 연동회원 가입여부를 확인합니다.
*/
router.get('/checkIsMember', function(req, res, next) {

  // 조회할 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  faxService.checkIsMember(testCorpNum,
    function(result) {
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', {code : Error.code, message : Error.message});
    });
});


/**
* 팝빌 회원아이디 중복여부를 확인합니다.
*/
router.get('/checkID', function (req, res, next) {

  // 조회할 아이디
  var testID = 'testkorea';

  faxService.checkID(testID,
    function(result) {
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 팝빌 연동회원 가입을 요청합니다.
*/
router.get('/joinMember', function(req,res,next) {

  // 회원정보
	var joinInfo = {

    // 링크아이디
  	LinkID : 'TESTER',

    // 사업자번호, '-' 제외 10자리
  	CorpNum : '1234567890',

    // 대표자명
    CEOName : '대표자성명',

    // 상호
  	CorpName : '테스트상호',

    // 주소
  	Addr : '주소',

    // 업태
  	BizType : '업태',

    // 종목
  	BizClass : '종목',

    // 담당자 성명
  	ContactName : '담당자 성명',

    // 메일주소
  	ContactEmail : 'test@test.com',

    // 연락처
  	ContactTEL : '070-4304-2991',

    // 회원 아이디
  	ID : 'userid',

    // 회원 비밀번호
  	PWD : 'this_is_password'
	};

  faxService.joinMember(joinInfo,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 연동회원의 팩스 API 서비스 과금정보를 확인합니다.
*/
router.get('/getChargeInfo', function (req, res, next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  faxService.getChargeInfo(testCorpNum,
    function(result) {
      res.render('Base/getChargeInfo', { path: req.path, result : result});
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 연동회원의 잔여포인트를 확인합니다.
* - 과금방식이 파트너과금인 경우 파트너 잔여포인트(GetPartnerBalance API)
*   를 통해 확인하시기 바랍니다.
*/
router.get('/getBalance', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  faxService.getBalance(testCorpNum,
    function(remainPoint) {
      res.render('result', {path : req.path, result : remainPoint})
    }, function(Error) {
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});


/**
* 파트너의 잔여포인트를 확인합니다.
* - 과금방식이 연동과금인 경우 연동회원 잔여포인트(GetBalance API)를
*   이용하시기 바랍니다.
*/
router.get('/getPartnerBalance', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  faxService.getPartnerBalance(testCorpNum,
    function(remainPoint) {
      res.render('result', {path : req.path, result : remainPoint});
    }, function(Error) {
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});


/**
* 팝빌 로그인, 포인트충전 팝업 URL을 반환합니다.
* - URL 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
*/
router.get('/getPopbillURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // LOGIN(팝빌 로그인), CHRG(포인트충전)
  var TOGO = 'CHRG';

  faxService.getPopbillURL(testCorpNum, TOGO,
    function(url) {
      res.render('result', {path : req.path, result : url});
    }, function(Error) {
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});


/**
* 연동회원의 담당자 목록을 확인합니다.
*/
router.get('/listContact', function (req, res, next) {

  // 조회할 아이디
  var testCorpNum = '1234567890';

  faxService.listContact(testCorpNum,
    function(result) {
      res.render('Base/listContact', { path: req.path, result : result});
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 연동회원의 담당자 정보를 수정합니다.
*/
router.get('/updateContact', function (req, res, next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';


  // 담당자 정보 항목
  var contactInfo =  {

    // 담당자명
    personName : '담당자명',

    // 연락처
    tel : '070-4304-2991',

    // 휴대폰번호
    hp : '010-1234-4324',

    // 메일주소
    email : 'dev@linkhub.co.kr',

    // 팩스번호
    fax : '070-1234-4324',

    // 전체조회여부, 회사조회(true), 개인조회(false)
    searchAllAllowYN : true
  };

  faxService.updateContact(testCorpNum, testUserID, contactInfo,
    function(result) {
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 연동회원의 담당자를 신규로 등록합니다.
*/
router.get('/registContact', function (req, res, next){

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 담당자 정보
  var contactInfo =  {

    // 아이디
    id : 'testkorea031213125',

    // 비밀번호
    pwd : 'testpassword',

    // 담당자명
    personName : '담당자명0309',

    // 연락처
    tel : '070-4304-2991',

    // 휴대폰번호
    hp : '010-1234-1234',

    // 메일주소
    email : 'dev@linkhub.co.kr',

    // 팩스번호
    fax : '070-4304-2991',

    // 회사조회여부, 회사조회(true), 개인조회(false)
    searchAllAllowYN : true
  };

  faxService.registContact(testCorpNum, contactInfo,
    function(result) {
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 연동회원의 회사정보를 확인합니다.
*/
router.get('/getCorpInfo', function (req, res, next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  faxService.getCorpInfo(testCorpNum,
    function(result) {
      res.render('Base/getCorpInfo', { path: req.path, result : result});
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 연동회원의 회사정보를 수정합니다
*/
router.get('/updateCorpInfo', function (req, res, next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 회사정보
  var corpInfo = {

    // 대표자명
    ceoname : "대표자성명",

    // 상호
    corpName : "업체명",

    // 주소
    addr : "서울시 강남구",

    // 업태
    bizType : "업태",

    // 종목
    bizClass : "종목"
  };

  faxService.updateCorpInfo(testCorpNum, corpInfo,
    function(result) {
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


// 팩스 단건 전송
router.get('/sendFAX', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 발신번호
  var senderNum = '07043042991';

  // 수신팩스번호
  var receiveNum = '0001111222';

  // 수신자명
  var receiveName = '수신자명';

  // 파일경로 배열
  var filePaths = ['../테스트.jpg', '../테스트.jpg'];

  // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
  var reserveDT = '';

  faxService.sendFax(testCorpNum, senderNum, receiveNum, receiveName, filePaths, reserveDT,
    function(receiptNum) {
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error) {
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});


// 팩스 대량 전송
router.get('/sendFAX_multi', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 발신번호
  var senderNum = '07043042991';

  // 파일경로 배열
  var filePaths = ['../테스트.jpg', '../테스트.jpg']

  // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
  var reserveDT = '';

  // 수신자정보 배열, 최대 1000건
  var Receivers = [
    {
      receiveName : '수신자명1',      // 수신자명
      receiveNum : '111222333',     // 수신팩스번호
    },
    {
      receiveName : '수신자명2',
      receiveNum : '000111222',
    }
  ]

  faxService.sendFax(testCorpNum, senderNum, Receivers, filePaths, reserveDT,
    function(receiptNum) {
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error) {
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});


/**
* 팩스를 재전송합니다.
* - 전송일로부터 180일이 경과되지 않은 전송건만 재전송할 수 있습니다.
*/
router.get('/resendFAX', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 팩스 접수번호
  var receiptNum = '017021715405400001';

  // 발신번호, 공백처리시 기존전송정보로 재전송
  var senderNum = '07043042991';

  // 발신자명, 공백처리시 기존전송정보로 재전송
  var senderName = '발신자명';

  // 수신팩스번호/수신자명 모두
  // 수신번호
  var receiveNum = '';

  // 수신자명
  var receiveName = '';

  // 예약전송일시 날짜형식(yyyyMMddHHmmss), 미기재시 즉시전송
  var reserveDT = '';

  faxService.resendFax(testCorpNum, receiptNum, senderNum, senderName, receiveNum, receiveName, reserveDT,
    function(receiptNum) {
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error) {
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});



/**
* 팩스를 재전송합니다.
* - 전송일로부터 180일이 경과되지 않은 전송건만 재전송할 수 있습니다.
*/
router.get('/resendFAX_multi', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 팩스 접수번호
  var receiptNum = '017021715405400001';

  // 발신번호, 공백처리시 기존전송정보로 재전송
  var senderNum = '07043042991';

  // 발신자명, 공백처리시 기존전송정보로 재전송
  var senderName = '발신자명';


  // 수신자정보 배열, 최대 1000건
  var Receivers = [
    {
      receiveName : '수신자명1',      // 수신자명
      receiveNum : '111222333',     // 수신팩스번호
    },
    {
      receiveName : '수신자명2',
      receiveNum : '000111222',
    }
  ]

  // 수신자정보를 기존전송정보와 동일하게 재전송하는 경우 아래코드 적용
  //var Receivers = null;

  faxService.sendFax(testCorpNum, receiptNum, senderNum, senderName, Receivers, reserveDT,
    function(receiptNum) {
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error) {
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

/**
* 팩스 전송결과 확인
*/
router.get('/getFaxResult', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 팩스전송 접수번호
  var receiptNum = '016111710222400001';

  faxService.getFaxResult(testCorpNum, receiptNum,
    function(result) {
      res.render('Fax/FaxResult',{path : req.path, result : result});
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 예약전송 팩스요청건을 취소합니다.
* - 예약전송 취소는 예약전송시간 10분전까지 가능합니다.
*/
router.get('/cancelReserve', function(req, res, next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 팩스전송 접수번호
  var receiptNum = '016111609371100001';

  faxService.cancelReserve(testCorpNum, receiptNum,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 팩스 전송내역 목록 팝업 URL을 반환합니다.
* - 보안정책으로 인해 반환된 URL은 30초의 유효시간을 갖습니다.
*/
router.get('/getURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 팩스 전송내역 조회 팝업 URL
  var TOGO = 'BOX';

  faxService.getURL(testCorpNum, TOGO,
    function(url) {
      res.render('result', { path : req.path, result : url });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 팩스 전송단가를 확인합니다.
*/
router.get('/getUnitCost', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  faxService.getUnitCost(testCorpNum,
    function(unitCost) {
      res.render('result', { path : req.path, result : unitCost });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 검색조건을 사용하여 팩스 전송내역 목록을 확인합니다.
*/
router.get('/search', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 시작일자, 날짜형식(yyyyMMdd)
  var SDate = '20161001';

  // 종료일자, 날짜형식(yyyyMMdd)
  var EDate = '20161131';

  // 전송상태값 배열, 1-대기, 2-성공, 3-실패, 4-취소
  var State = [1, 2, 3, 4];

  // 예약여부, true-예약전송건 조회, false-전체조회
  var ReserveYN = false;

  // 개인조회여부, true-개인조회, false-회사조회
  var SenderOnly = false;


  // 정렬방향, D-내림차순, A-오름차순
  var Order = 'D';

  // 페이지 번호
  var Page = 1;

  // 페이지당 검색개수, 최대 1000건
  var PerPage = 10;

  faxService.search(testCorpNum, SDate, EDate, State, ReserveYN, SenderOnly, Order, Page, PerPage,
    function(result) {
      res.render('Fax/Search', {path : req.path, result : result});
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

module.exports = router;
