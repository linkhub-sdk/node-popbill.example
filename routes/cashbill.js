var express = require('express');
var router = express.Router();
var popbill = require('popbill');

popbill.config({
  LinkID :'TESTER', //링크아이디
  SecretKey : 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=', //비밀키
  IsTest : true,   //연동환경 설정값, true(테스트용), false(상업용)
  defaultErrorHandler :  function(Error) {
    console.log('Error Occur : [' + Error.code + '] ' + Error.message);
  }
});

// 현금영수증 API 모듈초기화
var cashbillService = popbill.CashbillService();

// Cashbill API List Index
router.get('/', function(req, res, next) {
  res.render('Cashbill/index', {});
});

// 연동회원 가입여부 확인
router.get('/checkIsMember', function(req, res, next) {

  var testCorpNum = '1234567890';   // 조회할 사업자번호, '-' 제외 10자리

  cashbillService.checkIsMember(testCorpNum,
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
    ZipCode : '우편번호',
    BizType : '업태',
    BizClass : '업종',
    ContactName : '담당자 성명',
    ContactEmail : 'test@test.com',
    ContactTEL : '070-7510-6766',
    ID : 'userid',
    PWD : 'this_is_password'
  };

  cashbillService.joinMember(joinInfo,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 연동회원 잔여포인트 조회
router.get('/getBalance', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리

  cashbillService.getBalance(testCorpNum,
    function(remainPoint){
      res.render('result', {path : req.path, result : remainPoint})
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});

// 파트너 잔여포인트 조회
router.get('/getPartnerBalance', function(req,res,next){
  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리

  cashbillService.getPartnerBalance(testCorpNum,
    function(remainPoint){
      res.render('result', {path : req.path, result : remainPoint});
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
  });
});

// 팝빌 SSO URL 요청
router.get('/getPopbillURL', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';     // 팝빌회원 아이디
  var TOGO = 'CHRG';                // LOGIN(팝빌 로그인), CHRG(포인트충전)

  cashbillService.getPopbillURL(testCorpNum, testUserID, TOGO,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// 문서관리번호 사용여부 확인
router.get('/checkMgtKeyInUse', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-01';        // 문서관리번호

  cashbillService.checkMgtKeyInUse(testCorpNum,mgtKey,
    function(result){
      if(result){
        res.render('result', {path : req.path, result : '사용중'});
      } else {
        res.render('result', {path : req.path, result : '미사용중'});
      }
    }, function(Error){
    res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 임시저장
router.get('/register', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var MgtKey = '20150813-10';         // 문서관리번호, 1~24자리 숫자, 영문, '-', '_'를 조합하여 사업자별로 중복되지 않도록 작성

  // 현금영수증 항목
  var cashbill = {
    mgtKey : MgtKey,                  // [필수] 문서관리번호
    tradeType : '승인거래',             // [필수] 거래유형, (승인거래, 취소거래) 중 기재
    tradeUsage : '소득공제용',           // [필수] (소득공제용, 지출증빙용) 중 기재
    taxationType : '과세',             // [필수] (과세, 비과세) 중 기재
    identityNum : '01011112222',      // [필수] 거래처 식별번호
    // orgConfirmNum : '',            // 취소거래시 필수, 원본현금영수증의 국세청 승인번호 기재

    franchiseCorpNum : '1234567890',  // [필수] 발행자 사업자번호
    franchiseCorpName : '발행자 상호',
    franchiseCEOName : '발행자 대표자 성명',
    franchiseAddr : '발행자 주소',
    franchiseTEL : '000111222',

    customerName : '고객명',
    itemName : '상품명',
    orderNumber : '주문번호',
    email : 'test@test.com',
    hp : '000111222',
    fax : '000111222',
    smssendYN : false,             // 발행시 알림문자 전송여부

    supplyCost : '15000',          // [필수] 공급가액, ',' 콤마 불가, 숫자만가능
    tax : '5000',                  // [필수] 세액, ',' 콤마 불가, 숫자만가능
    serviceFee : '0',              // [필수] 봉사료, ',' 콤마 불가, 숫자만가능
    totalAmount : '20000',         // [거래금액], ',' 콤마 불가, 숫자만가능
  };

  cashbillService.register(testCorpNum,cashbill,
    function(result){
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 수정, 임시저장 상태의 문서만 수정가능
router.get('/update', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var MgtKey = '20150813-03';        // 문서관리번호, 1~24자리 숫자, 영문, '-', '_'를 조합하여 사업자별로 중복되지 않도록 작성

   //현금영수증 정보 객체
  var cashbill = {
    mgtKey : MgtKey,                  // [필수] 문서관리번호
    tradeType : '승인거래',             // [필수] 거래유형, (승인거래, 취소거래) 중 기재
    tradeUsage : '소득공제용',           // [필수] (소득공제용, 지출증빙용) 중 기재
    taxationType : '과세',             // [필수] (과세, 비과세) 중 기재
    identityNum : '01011112222',      // [필수] 거래처 식별번호
    // orgConfirmNum : '',            // 취소거래시 필수, 원본현금영수증의 국세청 승인번호 기재

    franchiseCorpNum : '1234567890',  // [필수] 발행자 사업자번호
    franchiseCorpName : '발행자 상호',
    franchiseCEOName : '발행자 대표자 성명',
    franchiseAddr : '발행자 주소',
    franchiseTEL : '000111222',

    customerName : '고객명',
    itemName : '상품명',
    orderNumber : '주문번호',
    email : 'test@test.com',
    hp : '000111222',
    fax : '000111222',
    smssendYN : false,             // 발행시 알림문자 전송여부

    supplyCost : '15000',          // [필수] 공급가액, ',' 콤마 불가, 숫자만가능
    tax : '5000',                  // [필수] 세액, ',' 콤마 불가, 숫자만가능
    serviceFee : '0',              // [필수] 봉사료, ',' 콤마 불가, 숫자만가능
    totalAmount : '20000',         // [거래금액], ',' 콤마 불가, 숫자만가능
  };

  cashbillService.update(testCorpNum, MgtKey, cashbill,
    function(result){
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 현금영수증 요약/상태정보 확인
router.get('/getInfo', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-03';         // 문서관리번호
  var testUserID = 'testkorea';       // 팝빌회원 아이디

  cashbillService.getInfo(testCorpNum, mgtKey, testUserID,
    function(result){
      res.render('Cashbill/CashbillInfo',{path : req.path, result : result});
    }, function(Error){
    res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 현금영수증 요약/상태정보 대량 확인(최대 1000건)
router.get('/getInfos', function(req,res,next){

  var testCorpNum = '1234567890';      // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKeyList = ['20150813-02', '20150813-03']   // 문서관리번호 배열, 최대 1000건
  var testUserID = 'testkorea';       // 팝빌회원 아이디

  cashbillService.getInfos(testCorpNum, mgtKeyList, testUserID,
    function(result){
      res.render('Cashbill/CashbillInfos',{path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 현금영수증 상세정보 확인
router.get('/getDetailInfo', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-03';        // 문서관리번호
  var testUserID = 'testkorea';      // 팝빌회원 아이디

  cashbillService.getDetailInfo(testCorpNum, mgtKey, testUserID,
    function(result){
      res.render('Cashbill/CashbillDetail',{path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 삭제
router.get('/delete', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-03';        // 문서관리번호

  cashbillService.delete(testCorpNum, mgtKey,
    function(result){
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 이력 조회
router.get('/getLogs', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-02';        // 문서관리번호
  var testUserID = 'testkorea';      // 팝빌회원 아이디

  cashbillService.getLogs(testCorpNum, mgtKey, testUserID,
    function(result){
      res.render('Cashbill/CashbillLogs', {path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 발행
router.get('/issue', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-10';        // 문서관리번호
  var memo = '발행메모';

  cashbillService.issue(testCorpNum, mgtKey, memo,
    function(result){
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 발행취소
router.get('/cancelIssue', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-10';        // 문서관리번호
  var memo = '발행취소 메모';

  cashbillService.cancelIssue(testCorpNum, mgtKey, memo,
    function(result){
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 알림메일 전송
router.get('/sendEmail', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-10';        // 문서관리번호
  var receiver = 'test@test.com';    // 수신메일주소

  cashbillService.sendEmail(testCorpNum, mgtKey, receiver,
    function(result){
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 알림문자 전송
router.get('/sendSMS', function(req,res,next){

  var testCorpNum = '1234567890';            // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-10';                // 문서관리번호
  var senderNum = '07075103710';             // 발신번호
  var receiverNum = '000111222';             // 수신번호
  var contents = '현금영수증 API 문자전송 테스트'   // 메세지 내용, 90byte 초과시 길이가 조정되어 전송

  cashbillService.sendSMS(testCorpNum, mgtKey, senderNum, receiverNum, contents,
    function(result){
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 현금영수증 팩스전송
router.get('/sendFAX', function(req,res,next){

  var testCorpNum = '1234567890';       // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-10';           // 문서관리번호
  var senderNum = '07075103710';        // 발신번호
  var receiverNum = '000111222';        // 수신팩스번호

  cashbillService.sendFAX(testCorpNum, mgtKey, senderNum, receiverNum,
    function(result){
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 현금영수증 관련 URL 확인
router.get('/getURL', function(req,res,next){

  var testCorpNum = '1234567890';       // 팝빌회원 사업자번호, '-' 제외 10자리
  var TOGO = 'PBOX';                    // PBOX(발행문서함), TBOX(임시문서함), WRITE(현금영수증 작성)
  var testUserID = 'testkorea';         // 팝빌회원 아이디

  cashbillService.getURL(testCorpNum, TOGO, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 현금영수증 보기 URL 확인
router.get('/getPopUpURL', function(req,res,next){

  var testCorpNum = '1234567890';       // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-10';           // 문서관리번호
  var testUserID = 'testkorea';         // 팝빌회원 아이디

  cashbillService.getPopUpURL(testCorpNum, mgtKey, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 현금영수증 인쇄 URL(단건)
router.get('/getPrintURL', function(req,res,next){

  var testCorpNum = '1234567890';       // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-10';           // 문서관리번호
  var testUserID = 'testkorea';         // 팝빌회원 아이디

  cashbillService.getPrintURL(testCorpNum, mgtKey, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 현금영수증 인쇄 URL(대량)
router.get('/getMassPrintURL', function(req,res,next){

  var testCorpNum = '1234567890';       // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKeyList = ['20150813-10', '20150813-02']; // 문서관리번호 배열, 최대 100건
  var testUserID = 'testkorea';         // 팝빌회원 아이디

  cashbillService.getMassPrintURL(testCorpNum, mgtKeyList, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 꽁급받는자 인쇄 URL
router.get('/getEPrintURL', function(req,res,next){

  var testCorpNum = '1234567890';       // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150811-10';           // 문서관리번호
  var testUserID = 'testkorea';         // 팝빌회원 아이디

  cashbillService.getEPrintURL(testCorpNum, mgtKey, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 공급받는자 수신메일 링크 URL
router.get('/getMailURL', function(req,res,next){

  var testCorpNum = '1234567890';       // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-10';           // 문서관리번호
  var testUserID = 'testkorea';         // 팝빌회원 아이디

  cashbillService.getMailURL(testCorpNum, mgtKey, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 현금영수증 발행단가 조회
router.get('/getUnitCost', function(req,res,next){

  var testCorpNum = '1234567890';       // 팝빌회원 사업자번호, '-' 제외 10자리

  cashbillService.getUnitCost(testCorpNum,
    function(unitCost){
      res.render('result', { path : req.path, result : unitCost });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


module.exports = router;
















