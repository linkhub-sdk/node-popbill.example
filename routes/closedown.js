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

  defaultErrorHandler :  function(Error){
    console.log('Error Occur : [' + Error.code + '] ' + Error.message);
  }
});

// 휴폐업조회 API 모듈초기화
var closedownService = popbill.ClosedownService();

router.get('/', function(req, res, next){
  res.render('Closedown/index', {});
});


/**
* 휴폐업조회 API 서비스 과금정보를 확인합니다.
*/
router.get('/getChargeInfo', function (req, res, next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  closedownService.getChargeInfo(testCorpNum, testUserID,
    function(result) {
      res.render('Base/getChargeInfo', { path: req.path, result : result});
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 팝빌 회원아이디 중복여부를 확인합니다.
*/
router.get('/checkID', function (req, res, next) {

  // 조회할 아이디
  var testID = 'testkorea';

  closedownService.checkID(testID,
    function(result) {
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 연동회원의 담당자 목록을 확인합니다.
*/
router.get('/listContact', function (req, res, next) {

  // 조회할 아이디
  var testCorpNum = '1234567890';

  closedownService.listContact(testCorpNum,
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
    personName : '담당자명0315',

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

  closedownService.updateContact(testCorpNum, testUserID, contactInfo,
    function(result) {
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 연동회원의 담당자를 신규로 등록합니다.
*/
router.get('/registContact', function (req, res, next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

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

    // 전체조회여부, 회사조회(true), 개인조회(false)
    searchAllAllowYN : true
  };

  closedownService.registContact(testCorpNum, testUserID, contactInfo,
    function(result) {
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 연동회원의 회사정보를 확인합니다.
*/
router.get('/getCorpInfo', function (req, res, next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  closedownService.getCorpInfo(testCorpNum,
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

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  // 회사정보
  var corpInfo = {

    // 대표자명
    ceoname : "대표자성명",

    // 상호
    corpName : "업체명",

    // 주소
    addr : "광산구 임방울대로",

    // 업태
    bizType : "업태",

    // 종목
    bizClass : "종목"
  };

  closedownService.updateCorpInfo(testCorpNum, testUserID, corpInfo,
    function(result) {
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 해당 사업자의 파트너 연동회원 가입여부를 확인합니다.
*/
router.get('/checkIsMember', function(req, res, next) {

  // 조회할 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  closedownService.checkIsMember(testCorpNum,
    function(result) {
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', {code : Error.code, message : Error.message});
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
  	BizClass : '업종',

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

  closedownService.joinMember(joinInfo,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
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

  closedownService.getBalance(testCorpNum,
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

  closedownService.getPartnerBalance(testCorpNum,
    function(remainPoint) {
      res.render('result', {path : req.path, result : remainPoint});
    }, function(Error) {
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
  });
});


/**
* 팝빌 로그인, 포인트충전 팝업 URL을 반환합니다.
* - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
*/
router.get('/getPopbillURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  // LOGIN(팝빌 로그인), CHRG(포인트충전), CERT(공인인증서 등록)
  var TOGO = 'LOGIN';

  closedownService.getPopbillURL(testCorpNum, testUserID, TOGO,
    function(url) {
      res.render('result', {path : req.path, result : url});
    }, function(Error) {
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});


/**
* 휴폐업조회 단가를 확인합니다.
*/
router.get('/getUnitCost', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  closedownService.getUnitCost(testCorpNum,
    function(unitCost) {
      res.render('result', { path : req.path, result : unitCost });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 1건의 사업자에 대한 휴폐업여부를 조회합니다.
*/
router.get('/checkCorpNum', function(req,res,next) {

  if ( req.query.CorpNum ) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 조회 사업자번호
    var checkCorpNum = req.query.CorpNum;

    closedownService.checkCorpNum(testCorpNum, checkCorpNum,
      function(CorpState) {
        res.render('Closedown/CheckCorpNum', { path : req.path, result : CorpState });
      }, function(Error) {
        res.render('response', {path : req.path,  code: Error.code, message : Error.message });
    });
  } else {
    var CorpState
    res.render('Closedown/CheckCorpNum', { path : req.path, result : CorpState });
  }
});


/**
* 대량의 사업자에 대한 휴폐업여부를 조회합니다. (최대 1000건)
*/
router.get('/checkCorpNums', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 조회 사업자번호 배열, 최대 1000건
  var checkCorpNumList = ['1234567890', '4108600477', '1249528799'];

  closedownService.checkCorpNums(testCorpNum, checkCorpNumList,
    function(CorpState) {
      res.render('Closedown/CheckCorpNums', { path : req.path, result : CorpState });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

module.exports = router;
