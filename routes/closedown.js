var express = require('express');
var router = express.Router();
var popbill = require('popbill');

popbill.config({
  LinkID :'TESTER', //링크아이디
  SecretKey : 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=', //비밀키
  IsTest : true,   //연동환경 설정값, true(테스트용), false(상업용)
  defaultErrorHandler :  function(Error){
    console.log('Error Occur : [' + Error.code + '] ' + Error.message);
  }
});

// 휴폐업조회 API 모듈초기화
var closedownService = popbill.ClosedownService();

router.get('/', function(req, res, next){
  res.render('Closedown/index', {});
});

// 아이디 중복 확인
router.get('/checkID', function (req, res, next){
  var testID = 'testkorea';  // 조회할 아이디

  closedownService.checkID(testID,
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

  closedownService.listContact(testCorpNum,
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

  closedownService.updateContact(testCorpNum, testUserID, contactInfo,
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

  closedownService.registContact(testCorpNum, testUserID, contactInfo,
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

  closedownService.getCorpInfo(testCorpNum,
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

  closedownService.updateCorpInfo(testCorpNum, testUserID, corpInfo,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 연동회원 가입여부 확인
router.get('/checkIsMember', function(req, res, next){

  var testCorpNum = '1234567890';   // 조회할 사업자번호, '-' 제외 10자리

  closedownService.checkIsMember(testCorpNum,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {code : Error.code, message : Error.message});
  });
});

// 회원가입 요청
router.get('/joinMember', function(req,res,next){

  var joinInfo =  {
    LinkID : 'TESTER',       // 링크아이디
    CorpNum : '1234567890',  // 사업자번호, '-' 제외 10자리
    CEOName : '대표자성명',
    CorpName : '테스트상호',
    Addr : '주소',
    ZipCode : '우편번호',
    BizType : '업태',
    BizClass : '업종',
    ContactName : '담당자 성명',
    ContactEmail : 'test@test.com',
    ContactTEL : '070-7510-3710',
    ID : 'userid',
    PWD : 'this_is_password'
  };

  closedownService.joinMember(joinInfo,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 연동회원 잔여포인트 조회
router.get('/getBalance', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리

  closedownService.getBalance(testCorpNum,
    function(remainPoint){
      res.render('result', {path : req.path, result : remainPoint})
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});

// 파트너 잔여포인트 조회
router.get('/getPartnerBalance', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리

  closedownService.getPartnerBalance(testCorpNum,
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
  var TOGO = 'LOGIN';               // LOGIN(팝빌 로그인), CHRG(포인트충전), CERT(공인인증서 등록)

  closedownService.getPopbillURL(testCorpNum, testUserID, TOGO,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// 휴폐업조회 단가
router.get('/getUnitCost', function(req,res,next){

  var testCorpNum = '1234567890';       // 팝빌회원 사업자번호, '-' 제외 10자리

  closedownService.getUnitCost(testCorpNum,
    function(unitCost){
      res.render('result', { path : req.path, result : unitCost });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 휴폐업조회 단건
router.get('/checkCorpNum', function(req,res,next){

  if(req.query.CorpNum){
    var testCorpNum = '1234567890';           // 팝빌회원 사업자번호, '-' 제외 10자리
    var checkCorpNum = req.query.CorpNum;     // 조회 사업자번호

    closedownService.checkCorpNum(testCorpNum, checkCorpNum,
      function(CorpState){
        res.render('Closedown/CheckCorpNum', { path : req.path, result : CorpState });
      },function(Error){
        res.render('response', {path : req.path,  code: Error.code, message : Error.message });
    });
  } else {
    var CorpState
    res.render('Closedown/CheckCorpNum', { path : req.path, result : CorpState });
  }
});

// 휴폐업조회 대량 (최대 1000건)
router.get('/checkCorpNums', function(req,res,next){

  var testCorpNum = '1234567890';                                       // 팝빌회원 사업자번호, '-' 제외 10자리
  var checkCorpNumList = ['1234567890', '4108600477', '1249528799'];    // 조회 사업자번호 배열, 최대 1000건

  closedownService.checkCorpNums(testCorpNum, checkCorpNumList,
    function(CorpState){
      res.render('Closedown/CheckCorpNums', { path : req.path, result : CorpState });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

module.exports = router;
