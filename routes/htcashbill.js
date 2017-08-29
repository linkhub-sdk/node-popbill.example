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
* 홈택스 현금영수증 API 연계 모듈 초기화
*/
var htCashbillService = popbill.HTCashbillService();

// API List Index
router.get('/', function(req, res, next) {
	res.render('HTCashbill/index', {});
});


/**
* 팝빌 회원아이디 중복여부를 확인합니다.
*/
router.get('/checkID', function (req, res, next) {

  // 조회할 아이디
  var testID = 'testkorea';

  htCashbillService.checkID(testID,
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

  htCashbillService.listContact(testCorpNum,
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

    // 담당자 아이디
    id : testUserID,

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

  htCashbillService.updateContact(testCorpNum, testUserID, contactInfo,
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

  htCashbillService.registContact(testCorpNum, contactInfo,
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

  htCashbillService.getCorpInfo(testCorpNum,
    function(result) {
      res.render('Base/getCorpInfo', { path: req.path, result : result});
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 연동회원의 홈택스 현금영수증 연계 API 서비스 과금정보를 확인합니다.
*/
router.get('/getChargeInfo', function (req, res, next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  htCashbillService.getChargeInfo(testCorpNum,
    function(result) {
      res.render('Base/getChargeInfo', { path: req.path, result : result});
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
    addr : "광산구 임방울대로",

    // 업태
    bizType : "업태",

    // 종목
    bizClass : "종목"
  };

  htCashbillService.updateCorpInfo(testCorpNum, corpInfo,
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

	htCashbillService.checkIsMember(testCorpNum,
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

	htCashbillService.joinMember(joinInfo,
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

  htCashbillService.getBalance(testCorpNum,
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

  htCashbillService.getPartnerBalance(testCorpNum,
    function(remainPoint) {
      res.render('result', {path : req.path, result : remainPoint});
    }, function(Error) {
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
  });
});


/**
* 파트너 포인트 충전 팝업 URL을 반환합니다.
* - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
*/
router.get('/getPartnerURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // CHRG(포인트충전)
  var TOGO = 'CHRG';

  htCashbillService.getPartnerURL(testCorpNum, TOGO,
    function(url) {
      res.render('result', {path : req.path, result : url});
    }, function(Error) {
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

/**
* 팝빌 관련 팝업 URL을 반환합니다.
* - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
*/
router.get('/getPopbillURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // LOGIN(팝빌 로그인), CHRG(포인트충전)
  var TOGO = 'CHRG';

  htCashbillService.getPopbillURL(testCorpNum, TOGO,
    function(url) {
      res.render('result', {path : req.path, result : url});
    }, function(Error) {
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});


/**
* 현금영수증 매출/매입 내역 수집을 요청합니다
* - 매출/매입 연계 프로세스는 "[홈택스 현금영수증 연계 API 연동매뉴얼]
*   > 1.2. 프로세스 흐름도" 를 참고하시기 바랍니다.
* - 수집 요청후 반환받은 작업아이디(JobID)의 유효시간은 1시간 입니다.
*/
router.get('/requestJob', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 세금계산서 유형, SELL-매출, BUY-매입, TRUSTEE-수탁
  var type = popbill.MgtKeyType.SELL;

  // 시작일자, 날짜형식(yyyyMMdd)
  var SDate = '20161001';

  // 종료일자, 날짜형식(yyyyMMdd)
  var EDate = '20161131';

  htCashbillService.requestJob(testCorpNum, type, SDate, EDate,
    function(jobID) {
      res.render('result', {path : req.path, result : jobID})
    }, function(Error) {
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});


/**
* 수집 요청 상태를 확인합니다.
* - 응답항목 관한 정보는 "[홈택스 현금영수증 연계 API 연동매뉴얼
*   > 3.2.2. GetJobState (수집 상태 확인)" 을 참고하시기 바랍니다 .
*/
router.get('/getJobState', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 작업아이디
  var jobID = '017030611000000002';

  htCashbillService.getJobState(testCorpNum, jobID,
    function(response) {
      res.render('HomeTax/jobState', {path : req.path, result : response})
    }, function(Error) {
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});


/**
* 수집 요청건들에 대한 상태 목록을 확인합니다.
* - 수집 요청 작업아이디(JobID)의 유효시간은 1시간 입니다.
* - 응답항목에 관한 정보는 "[홈택스 현금영수증 연계 API 연동매뉴얼]
*   > 3.2.3. ListActiveJob (수집상태 목록 확인)" 을 참고하시기 바랍니다.
*/
router.get('/listActiveJob', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  htCashbillService.listActiveJob(testCorpNum,
    function(response) {
      res.render('HomeTax/listActiveJob', {path : req.path, result : response})
    }, function(Error) {
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});


/**
* 현금영수증 매출/매입 수집결과를 조회합니다.
*/
router.get('/search', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 작업아이디
  var jobID = '017030611000000002';

  // 문서형태 배열, N-일반 현금영수증, C-취소 현금영수증
  var tradeType = ['N', 'C'];

  // 거래용도 배열, P-소득공제용, C-지출증빙용
  var tradeUsage = ['P', 'C'];


  // 페이지번호
  var page = 1;

  // 페이지당 검색개수
  var perPage = 10;

  // 정렬방향, D-내림차순, A-오름차순
  var order = 'D';

  htCashbillService.search(testCorpNum, jobID, tradeType, tradeUsage, page, perPage, order,
    function(response) {
      res.render('HTCashbill/search', {path : req.path, result : response})
    }, function(Error) {
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});


/**
* 검색조건을 사용하여 수집 결과 요약정보를 조회합니다.
* - 응답항목에 관한 정보는 "[홈택스 현금영수증 연계 API 연동매뉴얼]
*   > 3.3.2. Summary (수집 결과 요약정보 조회)" 을 참고하시기 바랍니다.
*/
router.get('/summary', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 작업아이디
  var jobID = '017030611000000002';


  // 문서형태 배열, N-일반 현금영수증, C-취소 현금영수증
  var tradeType = ['N', 'C'];

  // 거래용도 배열, P-소득공제용, C-지출증빙용
  var tradeUsage = ['P', 'C'];

  htCashbillService.summary(testCorpNum, jobID, tradeType, tradeUsage,
    function(response) {
      res.render('HTCashbill/summary', {path : req.path, result : response})
    }, function(Error) {
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});


/**
* 정액제 신청 팝업 URL을 반환합니다.
* - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
*/
router.get('/getFlatRatePopUpURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  htCashbillService.getFlatRatePopUpURL(testCorpNum,
    function(url) {
      res.render('result', {path : req.path, result : url});
    }, function(Error) {
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});


/**
* 연동회원의 정액제 서비스 이용상태를 확인합니다.
*/
router.get('/getFlatRateState', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  htCashbillService.getFlatRateState(testCorpNum,
    function(response) {
      res.render('HomeTax/flatRateState', {path : req.path, result : response});
    }, function(Error) {
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});


/**
* 홈택스 공인인증서 등록 팝업 URL을 반환합니다.
* - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
*/
router.get('/getCertificatePopUpURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  htCashbillService.getCertificatePopUpURL(testCorpNum,
    function(url) {
      res.render('result', {path : req.path, result : url});
    }, function(Error) {
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});


/**
* 등록된 홈택스 공인인증서의 만료일자를 확인합니다.
*/
router.get('/getCertificateExpireDate', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  htCashbillService.getCertificateExpireDate(testCorpNum,
    function(expireDate) {
      res.render('result', {path : req.path, result : expireDate});
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});


module.exports = router;
