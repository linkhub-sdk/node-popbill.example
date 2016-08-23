var express = require('express');
var router = express.Router();
var popbill = require('popbill');

popbill.config({
  LinkID :'TESTER', // 링크아이디
  SecretKey : 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=', // 비밀키
  IsTest : true,   // 연동환경 설정값, true(테스트용), false(상업용)
  defaultErrorHandler :  function(Error) {
    console.log('Error Occur : [' + Error.code + '] ' + Error.message);
  }
});

// 팩스 API 모듈초기화
var faxService = popbill.FaxService();

// 팩스 API List Index
router.get('/', function(req, res, next) {
  res.render('Fax/index', {});
});

// 과금정보 확인
router.get('/getChargeInfo', function (req, res, next){
  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';     // 팝빌회원 아이디

  faxService.getChargeInfo(testCorpNum, testUserID,
    function(result){
      res.render('Base/getChargeInfo', { path: req.path, result : result});
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 아이디 중복 확인
router.get('/checkID', function (req, res, next){
  var testID = 'testkorea';  // 조회할 아이디

  faxService.checkID(testID,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 담당자 목록 조회
router.get('/listContact', function (req, res, next){
  var testCorpNum = '1234567890';  // 조회할 아이디

  faxService.listContact(testCorpNum,
    function(result){
      res.render('Base/listContact', { path: req.path, result : result});
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 담당자 정보 수정
router.get('/updateContact', function (req, res, next){
  var testCorpNum = '1234567890';  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';

  var contactInfo =  {
    personName : '담당자명0315',
    tel : '070-7510-4324',
    hp : '010-1234-4324',
    email : 'code@linkhub.co.kr',
    fax : '070-1234-4324',
    searchAllAllowYN : true,
    mgrYN : true
  };

  faxService.updateContact(testCorpNum, testUserID, contactInfo,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});


// 담당자 추가
router.get('/registContact', function (req, res, next){
  var testCorpNum = '1234567890';  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';

  var contactInfo =  {
    id : 'testkorea0315',
    pwd : 'testpassword',
    personName : '담당자명0309',
    tel : '070-7510-3710',
    hp : '010-1234-1234',
    email : 'code@linkhub.co.kr',
    fax : '070-1234-1234',
    searchAllAllowYN : true,
    mgrYN : false
  };

  faxService.registContact(testCorpNum, testUserID, contactInfo,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 회사정보 조회
router.get('/getCorpInfo', function (req, res, next){
  var testCorpNum = '1234567890';  // 팝빌회원 사업자번호, '-' 제외 10자리

  faxService.getCorpInfo(testCorpNum,
    function(result){
      res.render('Base/getCorpInfo', { path: req.path, result : result});
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 회사정보 수정
router.get('/updateCorpInfo', function (req, res, next){
  var testCorpNum = '1234567890';  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';    // 팝빌회원 아이디

  var corpInfo = {
    ceoname : "대표자성명0315",
    corpName : "업체명_0315",
    addr : "서구 천변좌로_0315",
    bizType : "업태_0315",
    bizClass : "종목_0315"
  };

  faxService.updateCorpInfo(testCorpNum, testUserID, corpInfo,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 연동회원 가입여부 확인
router.get('/checkIsMember', function(req, res, next) {

    var testCorpNum = '1234567890';  // 조회할 사업자번호, '-' 제외 10자리

    faxService.checkIsMember(testCorpNum,
      function(result){
        res.render('response', { path: req.path, code: result.code, message : result.message });
      }, function(Error){
        res.render('response', {code : Error.code, message : Error.message});
      });
});

// 회원가입 요청
router.get('/joinMember', function(req,res,next) {

  var joinInfo =  {
    LinkID : 'TESTER',       // 링크아이디
    CorpNum : '1231212312',  // 사업자번호, '-' 제외 10자리
    CEOName : '대표자성명',
    CorpName : '테스트상호',
    Addr : '주소',
    BizType : '업태',
    BizClass : '업종',
    ContactName : '담당자 성명',
    ContactEmail : 'test@test.com',
    ContactTEL : '070-7510-6766',
    ID : 'userid',
    PWD : 'this_is_password'
  };

  faxService.joinMember(joinInfo,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 연동회원 잔여포인트 조회
router.get('/getBalance', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리

  faxService.getBalance(testCorpNum,
    function(remainPoint){
      res.render('result', {path : req.path, result : remainPoint})
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});

// 파트너 잔여포인트 조회
router.get('/getPartnerBalance', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리

  faxService.getPartnerBalance(testCorpNum,
    function(remainPoint){
      res.render('result', {path : req.path, result : remainPoint});
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});

// 팝빌 SSO URL 요청
router.get('/getPopbillURL', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';      // 팝빌회원 아이디
  var TOGO = 'LOGIN';                 // LOGIN(팝빌 로그인), CHRG(포인트충전),

  faxService.getPopbillURL(testCorpNum, testUserID, TOGO,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});

// 팩스 단건 전송
router.get('/sendFAX', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var senderNum = '07075103710';     // 발신번호
  var receiveNum = '0001111222';    // 수신팩스번호
  var receiveName = '수신자명';       // 수신자명
  var filePaths = ['../테스트.jpg', '../테스트.jpg'];    // 파일경로 배열
  var reserveDT = '';   // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송

  faxService.sendFax(testCorpNum, senderNum, receiveNum, receiveName, filePaths, reserveDT,
    function(receiptNum){
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// 팩스 대량 전송
router.get('/sendFAX_multi', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var senderNum = '07075103710';     // 발신번호
  var filePaths = ['../테스트.jpg', '../테스트.jpg']  // 파일경로 배열
  var reserveDT = '';   // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송

  //수신자정보 배열, 최대 1000건
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
    function(receiptNum){
      res.render('result', {path : req.path, result : receiptNum});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// 팩스 전송결과 확인
router.get('/getFaxResult', function(req,res,next){

  var testCorpNum = '1234567890';           // 팝빌회원 사업자번호, '-' 제외 10자리
  var receiptNum = '016080916291200001';    // 팩스전송 접수번호

  faxService.getFaxResult(testCorpNum,receiptNum,
    function(result){
      res.render('Fax/FaxResult',{path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 팩스 예약전송 취소
router.get('/cancelReserve', function(req, res, next) {

  var testCorpNum = '1234567890';           // 팝빌회원 사업자번호, '-' 제외 10자리
  var receiptNum = '015081210080500001';    // 팩스전송 접수번호

  faxService.cancelReserve(testCorpNum,receiptNum,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 팩스 전송내역 조회 팝업 URL
router.get('/getURL', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var TOGO = 'BOX';                  // 팩스 전송내역 조회 팝업 URL
  var testUserID = 'testkorea';      // 팝빌회원 아이디

  faxService.getURL(testCorpNum,TOGO,testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 팩스 전송단가 확인
router.get('/getUnitCost', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리

  faxService.getUnitCost(testCorpNum,
    function(unitCost){
      res.render('result', { path : req.path, result : unitCost });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


// 팩스 전송내역 조회
router.get('/search', function(req,res,next){

  var testCorpNum = '1234567890';         // 팝빌회원 사업자번호, '-' 제외 10자리
  var SDate = '20160101';                 // 시작일자, 작성형식(yyyyMMdd)
  var EDate = '20160317';                 // 종료일자, 작성형식(yyyyMMdd)

  var State = [1, 2, 3, 4];               // 전송상태값 배열, 1-대기, 2-성공, 3-실패, 4-취소
  var ReserveYN = false;                  // 예약여부, true-예약전송건 조회, false-전체조회
  var SenderOnly = false;                 // 개인조회여부, true-개인조회, false-회사조회

  var Order = 'D';                        // 정렬방향, D-내림차순, A-오름차순
  var Page = 1;                           // 페이지 번호
  var PerPage = 10;                       // 페이지당 검색개수, 최대 1000건

  faxService.search(testCorpNum, SDate, EDate, State, ReserveYN, SenderOnly, Order, Page, PerPage,
    function(result){
      res.render('Fax/Search', {path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});


module.exports = router;
