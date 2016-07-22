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

// 홈택스 전자세금계산서 API 연계 모듈 초기화
var htCashbillService = popbill.HTCashbillService();

// API List Index
router.get('/', function(req, res, next) {
	res.render('HTCashbill/index', {});
});

// 아이디 중복 확인
router.get('/checkID', function (req, res, next){
  var testID = 'testkorea';  // 조회할 아이디

  htCashbillService.checkID(testID,
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

  htCashbillService.listContact(testCorpNum,
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

  htCashbillService.updateContact(testCorpNum, testUserID, contactInfo,
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

  htCashbillService.registContact(testCorpNum, testUserID, contactInfo,
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

  htCashbillService.getCorpInfo(testCorpNum,
    function(result){
      res.render('Base/getCorpInfo', { path: req.path, result : result});
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 과금정보 확인
router.get('/getChargeInfo', function (req, res, next){
  var testCorpNum = '1234567890';  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';   // 팝빌회원 아이디

  htCashbillService.getChargeInfo(testCorpNum, testUserID,
    function(result){
      res.render('Base/getChargeInfo', { path: req.path, result : result});
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

  htCashbillService.updateCorpInfo(testCorpNum, testUserID, corpInfo,
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

	htCashbillService.checkIsMember(testCorpNum,
  	function(result){
    	res.render('response', { path: req.path, code: result.code, message : result.message });
  	}, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
	);
});

// 회원가입 요청
router.get('/joinMember', function(req,res,next) {

  // 가입정보 항목
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

	htCashbillService.joinMember(joinInfo,
		function(result){
			res.render('response', { path : req.path, code: result.code, message : result.message });
		},function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
    });
});

// 연동회원 잔여포인트 조회
router.get('/getBalance', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리

  htCashbillService.getBalance(testCorpNum,
    function(remainPoint){
      res.render('result', {path : req.path, result : remainPoint})
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});

// 팝빌 SSO URL 요청
router.get('/getPopbillURL', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';      // 팝빌회원 아이디
  var TOGO = 'CERT';                 // LOGIN(팝빌 로그인), CHRG(포인트충전), CERT(공인인증서 등록)

  htCashbillService.getPopbillURL(testCorpNum, testUserID, TOGO,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});

// 수집 요청
router.get('/requestJob', function(req,res,next){

  var testCorpNum = '4108600477';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'innoposttest';    // 팝빌회원 아이디
  var type = popbill.MgtKeyType.SELL; // 세금계산서 유형, SELL-매출, BUY-매입, TRUSTEE-수탁
  var SDate = '20160601';             // 시작일자, 표시형식(yyyyMMdd)
  var EDate = '20160831';             // 종료일자, 표시형식(yyyyMMdd)

  htCashbillService.requestJob(testCorpNum, type, SDate, EDate, testUserID,
    function(jobID){
      res.render('result', {path : req.path, result : jobID})
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});

// 수집 상태 확인
router.get('/getJobState', function(req,res,next){

  var testCorpNum = '4108600477';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var jobID = '016072210000000001';   // 작업아이디
  var testUserID = 'innoposttest';    // 팝빌회원 아이디

  htCashbillService.getJobState(testCorpNum, jobID, testUserID,
    function(response){
      res.render('HomeTax/jobState', {path : req.path, result : response})
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});

// 수집 상태 목록 확인
router.get('/listActiveJob', function(req,res,next){

  var testCorpNum = '4108600477';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'innoposttest';    // 팝빌회원 아이디

  htCashbillService.listActiveJob(testCorpNum, testUserID,
    function(response){
      res.render('HomeTax/listActiveJob', {path : req.path, result : response})
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});

// 수집 결과 조회
router.get('/search', function(req,res,next){

  var testCorpNum = '4108600477';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'innoposttest';    // 팝빌회원 아이디
  var jobID = '016072210000000002';   // 작업아이디

  var tradeType = ['N', 'C'];   // 문서형태, N-일반 현금영수증, C-취소 현금영수증
  var tradeUsage = ['P', 'C'];  // 거래용도, P-소득공제용, C-지출증빙용

  var page = 1;                // 페이지번호
  var perPage = 10;            // 페이지당 검색개수
  var order = 'D';             // 정렬방향, D-내림차순, A-오름차순

  htCashbillService.search(testCorpNum, jobID, tradeType, tradeUsage, page, perPage, order, testUserID,
    function(response){
      res.render('HTCashbill/search', {path : req.path, result : response})
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});

// 수집 결과 요약정보 조회
router.get('/summary', function(req,res,next){

  var testCorpNum = '4108600477';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'innoposttest';    // 팝빌회원 아이디
  var jobID = '016072210000000002';   // 작업아이디

  var tradeType = ['N', 'C'];   // 문서형태, N-일반 현금영수증, C-취소 현금영수증
  var tradeUsage = ['P', 'C'];  // 거래용도, P-소득공제용, C-지출증빙용

  htCashbillService.summary(testCorpNum, jobID, tradeType, tradeUsage, testUserID,
    function(response){
      res.render('HTCashbill/summary', {path : req.path, result : response})
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});

// 정액제 서비스 신청 URL
router.get('/getFlatRatePopUpURL', function(req,res,next){

  var testCorpNum = '4108600477';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'innoposttest';   // 팝빌회원 아이디

  htCashbillService.getFlatRatePopUpURL(testCorpNum, testUserID,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});


// 정액제 서비스 상태 확인
router.get('/getFlatRateState', function(req,res,next){

  var testCorpNum = '4108600477';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'innoposttest';   // 팝빌회원 아이디

  htCashbillService.getFlatRateState(testCorpNum, testUserID,
    function(response){
      res.render('HomeTax/flatRateState', {path : req.path, result : response});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});

// 홈택스연계 공인인증서 등록 URL
router.get('/getCertificatePopUpURL', function(req,res,next){

  var testCorpNum = '4108600477';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'innoposttest';   // 팝빌회원 아이디

  htCashbillService.getCertificatePopUpURL(testCorpNum, testUserID,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});

// 등록된 공인인증서 만료일자 확인
router.get('/getCertificateExpireDate', function(req,res,next){

  var testCorpNum = '4108600477';   // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'innoposttest';  // 팝빌회원 아이디

  htCashbillService.getCertificateExpireDate(testCorpNum,
    function(expireDate){
      res.render('result', {path : req.path, result : expireDate});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});


module.exports = router;
