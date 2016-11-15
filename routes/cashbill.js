var express = require('express');
var router = express.Router();
var popbill = require('popbill');

/**
* 팝빌 서비스 연동환경 초기화
*/
popbill.config({

  //링크아이디
  LinkID :'TESTER',

  //비밀키
  SecretKey : 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',

  //연동환경 설정값, 개발용(true), 상업용(false)
  IsTest : true,

  defaultErrorHandler :  function(Error) {
    console.log('Error Occur : [' + Error.code + '] ' + Error.message);
  }
});

/**
* 현금영수증 API 서비스 클래스 생성
*/
var cashbillService = popbill.CashbillService();


/**
* Cashbill API Index 목록
*/
router.get('/', function(req, res, next) {
  res.render('Cashbill/index', {});
});


/**
* 해당 사업자의 파트너 연동회원 가입여부를 확인합니다.
* - LinkID는 인증정보로 설정되어 있는 링크아이디 값입니다.
*/
router.get('/checkIsMember', function(req, res, next) {

  // 조회할 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  cashbillService.checkIsMember(testCorpNum,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {code : Error.code, message : Error.message});
  });
});


/**
* 팝빌 회원아이디 중복여부를 확인합니다.
*/
router.get('/checkID', function (req, res, next){
  var testID = 'testkorea';  // 조회할 아이디

  cashbillService.checkID(testID,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
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

  cashbillService.joinMember(joinInfo,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

/**
* 현금영수증 API 서비스 과금정보를 확인합니다.
*/
router.get('/getChargeInfo', function (req, res, next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  cashbillService.getChargeInfo(testCorpNum, testUserID,
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

  cashbillService.getBalance(testCorpNum,
    function(remainPoint) {
      res.render('result', {path : req.path, result : remainPoint})
    }, function(Error) {
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
    });
});


/**
* 파트너의 잔여포인트를 확인합니다.
* - 과금방식이 연동과금인 경우 연동회원 잔여포인트(GetBalance API)를 이용하시기 바랍니다.
*/
router.get('/getPartnerBalance', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  cashbillService.getPartnerBalance(testCorpNum,
    function(remainPoint) {
      res.render('result', {path : req.path, result : remainPoint});
    }, function(Error) {
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
  });
});


/**
* 팝빌 관련 팝업 URL을 반환합니다.
* - 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
*/
router.get('/getPopbillURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  // LOGIN(팝빌 로그인), CHRG(포인트충전)
  var TOGO = 'CHRG';

  cashbillService.getPopbillURL(testCorpNum, testUserID, TOGO,
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

  cashbillService.listContact(testCorpNum,
    function(result) {
      res.render('Base/listContact', { path: req.path, result : result});
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 연동회원의 담당자 정보를 수정합니다.
*/
router.get('/updateContact', function (req, res, next){

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

    // 전체조회여부, 전체조회(true), 회사조회(false)
    searchAllAllowYN : true
  };

  cashbillService.updateContact(testCorpNum, testUserID, contactInfo,
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

    // 전체조회여부, 전체조회(true), 회사조회(false)
    searchAllAllowYN : true
  };

  cashbillService.registContact(testCorpNum, testUserID, contactInfo,
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

  cashbillService.getCorpInfo(testCorpNum,
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
    ceoname : "대표자성명0315",

    // 상호
    corpName : "업체명_0315",

    // 주소
    addr : "서구 천변좌로_0315",

    // 업태
    bizType : "업태_0315",

    // 종목
    bizClass : "종목_0315"
  };

  cashbillService.updateCorpInfo(testCorpNum, testUserID, corpInfo,
    function(result) {
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 현금영수증 관리번호 중복여부를 확인합니다.
* - 관리번호는 1~24자리로 숫자, 영문 '-', '_' 조합으로 사업자별로 중복되지 않도록 구성해야합니다.
*/
router.get('/checkMgtKeyInUse', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20150813-01';

  cashbillService.checkMgtKeyInUse(testCorpNum,mgtKey,
    function(result) {
      if(result) {
        res.render('result', {path : req.path, result : '사용중'});
      } else {
        res.render('result', {path : req.path, result : '미사용중'});
      }
    }, function(Error) {
    res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 1건의 현금영수증을 즉시발행합니다.
* - 발행일 기준 오후 5시 이전에 발행된 현금영수증은 다음날 오후 2시에 국세청
*   전송결과를 확인할 수 있습니다.
* - 현금영수증 국세청 전송 정책에 대한 정보는 "[현금영수증 API 연동매뉴얼]
*   > 1.4. 국세청 전송정책"을 참조하시기 바랍니다.
* - 취소현금영수증 작성방법 안내 - http://blog.linkhub.co.kr/702
*/
router.get('/registIssue', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호, 1~24자리 숫자, 영문, '-', '_'를 조합하여 사업자별로 중복되지 않도록 작성
  var MgtKey = '20161115-01';

  // 현금영수증 항목
  var cashbill = {

     // [필수] 문서관리번호
    mgtKey : MgtKey,

    // [필수] 거래유형, (승인거래, 취소거래) 중 기재
    tradeType : '승인거래',

    // [취소 현금영수증 발행시 필수] 원본 현금영수증 국세청 승인번호
    // 국세청 승인번호는 GetInfo API의 ConfirmNum 항목으로 확인할 수 있습니다.
    // orgConfirmNum : '',

    // [필수] 과세형태 (과세, 비과세) 중 기재
    taxationType : '과세',

    // [필수] (소득공제용, 지출증빙용) 중 기재
    tradeUsage : '소득공제용',

    // [필수] 거래처 식별번호, 거래유형에 따라 작성
    // 소득공제용 - 주민등록/휴대폰/카드번호 기재가능
    // 지출증빙용 - 사업자번호/주민등록/휴대폰/카드번호 기재가능
    identityNum : '01011112222',

    // [필수] 발행자 사업자번호
    franchiseCorpNum : '1234567890',

    // 발행자 상호
    franchiseCorpName : '발행자 상호',

    // 발행자 대표자성명
    franchiseCEOName : '발행자 대표자 성명',

    // 발행자 주소
    franchiseAddr : '발행자 주소',

    // 발행자 연락처
    franchiseTEL : '01012341234',

    // [필수] 공급가액
    supplyCost : '15000',

    // [필수] 세액
    tax : '5000',

    // [필수] 봉사료
    serviceFee : '0',

    // [필수] 거래금액 (공급가액 + 세액 + 봉사료)
    totalAmount : '20000',

    // 고객명
    customerName : '고객명',

    // 상품명
    itemName : '상품명',

    // 주문번호
    orderNumber : '주문번호',

    // 고객 메일주소
    email : 'test@test.com',

    // 고객 핸드폰번호
    hp : '010111222',

    // 고객 팩스번호
    fax : '000111222',

    // 발행시 알림문자 전송여부
    // 문자전송시 포인트가 차감되며 전송실패시 환불처리됨.
    smssendYN : false,
  };

  cashbillService.registIssue(testCorpNum,cashbill,
    function(result) {
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 1건의 현금영수증을 임시저장 합니다.
* - [임시저장] 상태의 현금영수증은 발행(Issue API)을 호출해야만 국세청에 전송됩니다.
* - 발행일 기준 오후 5시 이전에 발행된 현금영수증은 다음날 오후 2시에 국세청 전송결과를 확인할 수 있습니다.
* - 현금영수증 국세청 전송 정책에 대한 정보는 "[현금영수증 API 연동매뉴얼]
*   > 1.4. 국세청 전송정책"을 참조하시기 바랍니다.
* - 취소현금영수증 작성방법 안내 - http://blog.linkhub.co.kr/702
*/
router.get('/register', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호, 1~24자리 숫자, 영문, '-', '_'를 조합하여 사업자별로 중복되지 않도록 작성
  var MgtKey = '20161115-02';

  // 현금영수증 항목
  var cashbill = {

     // [필수] 문서관리번호
    mgtKey : MgtKey,

    // [필수] 거래유형, (승인거래, 취소거래) 중 기재
    tradeType : '승인거래',

    // [취소 현금영수증 발행시 필수] 원본 현금영수증 국세청 승인번호
    // 국세청 승인번호는 GetInfo API의 ConfirmNum 항목으로 확인할 수 있습니다.
    // orgConfirmNum : '',

    // [필수] 과세형태 (과세, 비과세) 중 기재
    taxationType : '과세',

    // [필수] (소득공제용, 지출증빙용) 중 기재
    tradeUsage : '소득공제용',

    // [필수] 거래처 식별번호, 거래유형에 따라 작성
    // 소득공제용 - 주민등록/휴대폰/카드번호 기재가능
    // 지출증빙용 - 사업자번호/주민등록/휴대폰/카드번호 기재가능
    identityNum : '01011112222',

    // [필수] 발행자 사업자번호
    franchiseCorpNum : '1234567890',

    // 발행자 상호
    franchiseCorpName : '발행자 상호',

    // 발행자 대표자성명
    franchiseCEOName : '발행자 대표자 성명',

    // 발행자 주소
    franchiseAddr : '발행자 주소',

    // 발행자 연락처
    franchiseTEL : '01012341234',

    // [필수] 공급가액
    supplyCost : '15000',

    // [필수] 세액
    tax : '5000',

    // [필수] 봉사료
    serviceFee : '0',

    // [필수] 거래금액 (공급가액 + 세액 + 봉사료)
    totalAmount : '20000',

    // 고객명
    customerName : '고객명',

    // 상품명
    itemName : '상품명',

    // 주문번호
    orderNumber : '주문번호',

    // 고객 메일주소
    email : 'test@test.com',

    // 고객 핸드폰번호
    hp : '010111222',

    // 고객 팩스번호
    fax : '000111222',

    // 발행시 알림문자 전송여부
    // 문자전송시 포인트가 차감되며 전송실패시 환불처리됨.
    smssendYN : false,
  };

  cashbillService.register(testCorpNum,cashbill,
    function(result) {
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 1건의 현금영수증을 수정합니다.
* - [임시저장] 상태의 현금영수증만 수정할 수 있습니다.
* - 국세청에 신고된 현금영수증은 수정할 수 없으며, 취소 현금영수증을 발행하여 취소처리 할 수 있습니다.
* - 취소현금영수증 작성방법 안내 - http://blog.linkhub.co.kr/702
*/
router.get('/update', function(req,res,next){

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호, 1~24자리 숫자, 영문, '-', '_'를 조합하여 사업자별로 중복되지 않도록 작성
  var MgtKey = '20161115-01';

  // 현금영수증 항목
  var cashbill = {

     // [필수] 문서관리번호
    mgtKey : MgtKey,

    // [필수] 거래유형, (승인거래, 취소거래) 중 기재
    tradeType : '승인거래',

    // [취소 현금영수증 발행시 필수] 원본 현금영수증 국세청 승인번호
    // 국세청 승인번호는 GetInfo API의 ConfirmNum 항목으로 확인할 수 있습니다.
    // orgConfirmNum : '',

    // [필수] 과세형태 (과세, 비과세) 중 기재
    taxationType : '과세',

    // [필수] (소득공제용, 지출증빙용) 중 기재
    tradeUsage : '소득공제용',

    // [필수] 거래처 식별번호, 거래유형에 따라 작성
    // 소득공제용 - 주민등록/휴대폰/카드번호 기재가능
    // 지출증빙용 - 사업자번호/주민등록/휴대폰/카드번호 기재가능
    identityNum : '01011112222',

    // [필수] 발행자 사업자번호
    franchiseCorpNum : '1234567890',

    // 발행자 상호
    franchiseCorpName : '발행자 상호_수정',

    // 발행자 대표자성명
    franchiseCEOName : '발행자 대표자 성명',

    // 발행자 주소
    franchiseAddr : '발행자 주소',

    // 발행자 연락처
    franchiseTEL : '01012341234',

    // [필수] 공급가액
    supplyCost : '15000',

    // [필수] 세액
    tax : '5000',

    // [필수] 봉사료
    serviceFee : '0',

    // [필수] 거래금액 (공급가액 + 세액 + 봉사료)
    totalAmount : '20000',

    // 고객명
    customerName : '고객명',

    // 상품명
    itemName : '상품명',

    // 주문번호
    orderNumber : '주문번호',

    // 고객 메일주소
    email : 'test@test.com',

    // 고객 핸드폰번호
    hp : '010111222',

    // 고객 팩스번호
    fax : '000111222',

    // 발행시 알림문자 전송여부
    // 문자전송시 포인트가 차감되며 전송실패시 환불처리됨.
    smssendYN : false,
  };

  cashbillService.update(testCorpNum, MgtKey, cashbill,
    function(result) {
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 1건의 현금영수증 상태/요약 정보를 확인합니다.
* - 응답항목에 대한 자세한 정보는 "[현금영수증 API 연동매뉴얼] > 4.2.
*   현금영수증 상태정보 구성"을 참조하시기 바랍니다.
*/
router.get('/getInfo', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  cashbillService.getInfo(testCorpNum, mgtKey, testUserID,
    function(result) {
      res.render('Cashbill/CashbillInfo',{path : req.path, result : result});
    }, function(Error) {
    res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

/**
* 대량의 현금영수증 상태/요약 정보를 확인합니다. (최대 1000건)
* - 응답항목에 대한 자세한 정보는 "[현금영수증 API 연동매뉴얼] > 4.2.
*   현금영수증 상태정보 구성"을 참조하시기 바랍니다.
*/
router.get('/getInfos', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호 배열, 최대 1000건
  var mgtKeyList = ['20150813-02', '20150813-03', '20161115-01']

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  cashbillService.getInfos(testCorpNum, mgtKeyList, testUserID,
    function(result) {
      res.render('Cashbill/CashbillInfos',{path : req.path, result : result});
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 현금영수증 1건의 상세정보를 조회합니다.
* - 응답항목에 대한 자세한 사항은 "[현금영수증 API 연동매뉴얼] > 4.1.
*   현금영수증 구성" 을 참조하시기 바랍니다.
*/
router.get('/getDetailInfo', function(req,res,next){

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  cashbillService.getDetailInfo(testCorpNum, mgtKey, testUserID,
    function(result){
      res.render('Cashbill/CashbillDetail',{path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 1건의 현금영수증을 삭제합니다.
* - 현금영수증을 삭제하면 사용된 문서관리번호(mgtKey)를 재사용할 수 있습니다.
* - 삭제가능한 문서 상태 : [임시저장], [발행취소]
*/
router.get('/delete', function(req,res,next){

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  cashbillService.delete(testCorpNum, mgtKey,
    function(result){
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 현금영수증 상태 변경이력을 확인합니다.
* - 상태 변경이력 확인(GetLogs API) 응답항목에 대한 자세한 정보는
*   "[현금영수증 API 연동매뉴얼] > 3.4.4 상태 변경이력 확인"
*   을 참조하시기 바랍니다.
*/
router.get('/getLogs', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  cashbillService.getLogs(testCorpNum, mgtKey, testUserID,
    function(result) {
      res.render('Cashbill/CashbillLogs', {path : req.path, result : result});
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 1건의 임시저장 현금영수증을 발행처리합니다.
* - 발행일 기준 오후 5시 이전에 발행된 현금영수증은 다음날 오후 2시에 국세청
*   전송결과를 확인할 수 있습니다.
* - 현금영수증 국세청 전송 정책에 대한 정보는 "[현금영수증 API 연동매뉴얼]
*   > 1.4. 국세청 전송정책"을 참조하시기 바랍니다.
*/
router.get('/issue', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  // 메모
  var memo = '발행메모';

  cashbillService.issue(testCorpNum, mgtKey, memo,
    function(result) {
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* [발행완료] 상태의 현금영수증을 [발행취소] 합니다.
* - 발행취소는 국세청 전송전에만 가능합니다.
* - 발행취소된 형금영수증은 국세청에 전송되지 않습니다.
*/
router.get('/cancelIssue', function(req,res,next){

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  // 메모
  var memo = '발행취소 메모';

  cashbillService.cancelIssue(testCorpNum, mgtKey, memo,
    function(result){
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 현금영수증 발행 안내메일을 재전송합니다.
*/
router.get('/sendEmail', function(req,res,next){

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  // 수신메일주소
  var receiver = 'test@test.com';

  cashbillService.sendEmail(testCorpNum, mgtKey, receiver,
    function(result){
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 알림문자를 전송합니다. (단문/SMS- 한글 최대 45자)
* - 알림문자 전송시 포인트가 차감됩니다. (전송실패시 환불처리)
* - 전송내역 확인은 "팝빌 로그인" > [문자 팩스] > [전송내역] 탭에서
*   전송결과를 확인할 수 있습니다.
*/
router.get('/sendSMS', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  // 발신번호
  var senderNum = '07043042991';

  // 수신번호
  var receiverNum = '000111222';

  // 메세지 내용, 90byte 초과시 길이가 조정되어 전송됨
  var contents = '현금영수증 API 문자전송 테스트'

  cashbillService.sendSMS(testCorpNum, mgtKey, senderNum, receiverNum, contents,
    function(result) {
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 현금영수증을 팩스전송합니다.
* - 팩스 전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
* - 전송내역 확인은 "팝빌 로그인" > [문자 팩스] > [팩스] > [전송내역]
*   메뉴에서 전송결과를 확인할 수 있습니다.
*/
router.get('/sendFAX', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  // 발신번호
  var senderNum = '07043042991';

  // 수신팩스번호
  var receiverNum = '000111222';

  cashbillService.sendFAX(testCorpNum, mgtKey, senderNum, receiverNum,
    function(result) {
      res.render('response', {path : req.path,  code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 팝빌 현금영수증 문서함 팝업 URL을 반환합니다.
* - 보안정책으로 인해 반환된 URL의 유효시간은 30초입니다.
*/
router.get('/getURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // PBOX(발행문서함), TBOX(임시문서함), WRITE(현금영수증 작성)
  var TOGO = 'PBOX';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  cashbillService.getURL(testCorpNum, TOGO, testUserID,
    function(url) {
      res.render('result', { path : req.path, result : url });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 1건의 현금영수증 보기 팝업 URL을 반환합니다.
* - 보안정책으로 인해 반환된 URL의 유효시간은 30초입니다.
*/
router.get('/getPopUpURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  cashbillService.getPopUpURL(testCorpNum, mgtKey, testUserID,
    function(url) {
      res.render('result', { path : req.path, result : url });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 1건의 현금영수증 인쇄팝업 URL을 반환합니다.
* - 보안정책으로 인해 반환된 URL의 유효시간은 30초입니다.
*/
router.get('/getPrintURL', function(req,res,next){

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  cashbillService.getPrintURL(testCorpNum, mgtKey, testUserID,
    function(url) {
      res.render('result', { path : req.path, result : url });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 대량의 현금영수증 인쇄팝업 URL을 반환합니다. (최대 100건)
* 보안정책으로 인해 반환된 URL의 유효시간은 30초입니다.
*/
router.get('/getMassPrintURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호 배열, 최대 100건
  var mgtKeyList = ['20161115-01', '20150813-10', '20150813-02'];

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  cashbillService.getMassPrintURL(testCorpNum, mgtKeyList, testUserID,
    function(url) {
      res.render('result', { path : req.path, result : url });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 현금영수증 인쇄(공급받는자) URL을 반환합니다.
* - URL 보안정책에 따라 반환된 URL은 30초의 유효시간을 갖습니다.
*/
router.get('/getEPrintURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  cashbillService.getEPrintURL(testCorpNum, mgtKey, testUserID,
    function(url) {
      res.render('result', { path : req.path, result : url });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 공급받는자 메일링크 URL을 반환합니다.
* - 메일링크 URL은 유효시간이 존재하지 않습니다.
*/
router.get('/getMailURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 문서관리번호
  var mgtKey = '20161115-01';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  cashbillService.getMailURL(testCorpNum, mgtKey, testUserID,
    function(url) {
      res.render('result', { path : req.path, result : url });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 현금영수증 발행단가를 확인합니다.
*/
router.get('/getUnitCost', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  cashbillService.getUnitCost(testCorpNum,
    function(unitCost) {
      res.render('result', { path : req.path, result : unitCost });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 검색조건을 사용하여 현금영수증 목록을 조회합니다.
* - 응답항목에 대한 자세한 사항은 "[현금영수증 API 연동매뉴얼] >
*   4.2. 현금영수증 상태정보 구성" 을 참조하시기 바랍니다.
*/
router.get('/search', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 검색일자 유형, R-등록일자, W-작성일자, I-발행일자
  var DType = 'T';

  // 시작일자, 작성형식(yyyyMMdd)
  var SDate = '20161001';

  // 종료일자, 작성형식(yyyyMMdd)
  var EDate = '20161131';

  // 전송상태값 배열, 2,3번째 자리에 와일드카드(*) 사용가능
  var State = ['100','200','3**', '4**'];

  // 현금영수증 종류 배열, N-일반현금영수증, C-취소현금영수증
  var TradeType = ['N', 'C'];

  // 현금영수증 용도 배열, P-소득공제용, C-지출증빙용
  var TradeUsage = ['P', 'C'];

  // 과세유형 배열, T-과세, N-비과세
  var TaxationType = ['T', 'N'];

  // 현금영수증 식별번호, 미기재시 전체조회
  var QString = '';

  // 정렬방향, D-내림차순, A-오름차순
  var Order = 'D';

  // 페이지 번호
  var Page = 1;

  // 페이지당 검색개수, 최대 1000건
  var PerPage = 10;

  cashbillService.search(testCorpNum, DType, SDate, EDate, State, TradeType,
                      TradeUsage, TaxationType, QString, Order, Page, PerPage,
    function(result) {
      res.render('Cashbill/Search', {path : req.path, result : result});
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

module.exports = router;
