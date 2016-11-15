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
* 전자명세서 API 서비스 클래스 생성
*/
var statementService = popbill.StatementService();


/**
* Statement API Index 목록
*/
router.get('/', function(req, res, next) {
  res.render('Statement/index', {});
});


/**
* 해당 사업자의 파트너 연동회원 가입여부를 확인합니다.
*/
router.get('/checkIsMember', function(req, res, next) {

  // 조회할 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  statementService.checkIsMember(testCorpNum,
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

  statementService.checkID(testID,
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

  statementService.joinMember(joinInfo,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 전자명세서 API 서비스 과금정보를 확인합니다.
*/
router.get('/getChargeInfo', function (req, res, next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 명세서 종류코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.getChargeInfo(testCorpNum, itemCode, testUserID,
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
router.get('/getBalance', function(req,res,next){

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  statementService.getBalance(testCorpNum,
    function(remainPoint) {
      res.render('result', {path : req.path, result : remainPoint});
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

  statementService.getPartnerBalance(testCorpNum,
    function(remainPoint) {
      res.render('result', {path : req.path, result : remainPoint});
    }, function(Error) {
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
  });
});


/**
* 팝빌 관련 URL을 반환합니다.
* 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
*/
router.get('/getPopbillURL', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  // LOGIN(팝빌 로그인), CHRG(포인트충전), SEAL(인감 및 첨부문서 등록)
  var TOGO = 'CHRG';

  statementService.getPopbillURL(testCorpNum, testUserID, TOGO,
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

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  statementService.listContact(testCorpNum,
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

    // 전체조회여부, 전체조회(true), 회사조회(false)
    searchAllAllowYN : true
  };

  statementService.updateContact(testCorpNum, testUserID, contactInfo,
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

  statementService.registContact(testCorpNum, testUserID, contactInfo,
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

  statementService.getCorpInfo(testCorpNum,
    function(result) {
      res.render('Base/getCorpInfo', { path: req.path, result : result});
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});


/**
* 연동회원의 회사정보를 수정합니다
*/
router.get('/updateCorpInfo', function (req, res, next){

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
    addr : "서울시 강남구",

    // 업태
    bizType : "업태",

    // 종목
    bizClass : "종목"
  };

  statementService.updateCorpInfo(testCorpNum, testUserID, corpInfo,
    function(result) {
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error) {
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    });
});


/**
* 전자명세서 관리번호 중복여부를 확인합니다.
* - 관리번호는 1~24자리로 숫자, 영문 '-', '_' 조합하여 사업자별로 중복되지 않도록 구성해야합니다.
*/
router.get('/checkMgtKeyInUse', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20150813-01';

  statementService.checkMgtKeyInUse(testCorpNum, itemCode, mgtKey,
    function(result) {
      if(result) {
        res.render('result', {path : req.path, result : '사용중'});
      } else {
        res.render('result', {path : req.path, result : '미사용중'});
      }
    }, function(Error) {
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});


/**
* 1건의 전자명세서를 즉시발행 처리합니다.
*/
router.get('/registIssue', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var ItemCode = 121;

  // 문서관리번호, 1~24자리 영문, 숫자, '-', '_' 조합으로 구성, 사업자별로 중복되지 않도록 생성
  var MgtKey = '20161115-02';


  // 전자명세서 정보
  var statement = {

    // [필수] 기재상 작성일자, 날짜형식(yyyyMMdd)
    writeDate : '20161115',

    // [필수] 영수, 청구 중 기재
    purposeType : '영수',

    // [필수] 과세형태, 과세, 영세, 면세 중 기재
    taxType : '과세',

    // 맞춤양식코드, 미기재시 기본양식으로 작성
    formCode : '',

    // [필수] 명세서 코드
    itemCode : ItemCode,

    // [필수] 문서관리번호
    mgtKey : MgtKey,

    /**************************************************************************
    *                             공급자 정보
    **************************************************************************/

    // 공급자 사업자번호
    senderCorpNum : testCorpNum,

    // 공급자 상호
    senderCorpName : '공급자 상호',

    // 공급자 주소
    senderAddr : '공급자 주소',

    // 공급자 대표자 성명
    senderCEOName : '공급자 대표자 성명',

    // 종사업장 식별번호, 필요시기재, 형식은 숫자 4자리
    senderTaxRegID : '',

    // 공급자 종목
    senderBizClass : '종목',

    // 공급자 업태
    senderBizType : '업태',

    // 공급자 담당자명
    senderContactName : '담당자명',

    // 공급자 메일주소
    senderEmail : 'test@test.com',

    // 공급자 연락처
    senderTEL : '070-4304-2991',

    // 공급자 휴대폰번호
    senderHP : '000-111-222',

    /**************************************************************************
    *                             공급받는자 정보
    **************************************************************************/

    // 공급받는자 사업자번호
    receiverCorpNum : '8888888888',

    // 공급받는자 상호
    receiverCorpName : '공급받는자상호',

    // 공급받는자 대표자 성명
    receiverCEOName : '공급받는자 대표자 성명',

    // 공급받는자 주소
    receiverAddr : '공급받는자 주소',

    // 공급받는자 종사업장 식별번호, 필요시 기재
    recieverTaxRegID : '',

    // 공급받는자 종목
    receiverBizClass : '종목',

    // 공급받는자 업태
    receiverBizType : '업태',

    // 공급받는자 담당자명
    receiverContactName : '공급받는자 담당자 성명',

    // 공급받는자 메일주소
    receiverEmail : 'test@test.com',

    // 공급받는자 연락처
    receiverTEL : '070-1111-2222',

    // 공급받는자 휴대폰 번호
    receiverHP : '000111222',

    /**************************************************************************
    *                            전자명세서 기재정보
    **************************************************************************/

    // [필수] 공급가액 합계
    supplyCostTotal : '20000',

    // [필수] 세액 합계
    taxTotal : '2000',

    // [필수] 합계금액 (공급가액 합계+ 세액 합계)
    totalAmount : '22000',

    // 기재 상 '일련번호' 항목
    serialNum : '1',

    // 기재 상 '비고' 항목
    remark1 : '비고1',
    remark2 : '비고2',
    remark3 : '비고3',

    // 사업자등록증 이미지 첨부 여부
    businessLicenseYN : false,

    // 통장사본 이미지 첨부 여부
    bankBookYN : false,


    /**************************************************************************
    *                          상세9항목(품목) 정보
    **************************************************************************/

    detailList : [
      {
        serialNum : 1,                // 품목 일련번호 1부터 순차기재
        itemName : '품명',
        purchaseDT : '20161115',      // 구매일자
        qty : '1',                    // 수량
        unitCost : '10000',           // 단가
        spec : '규격',                 // 규격
        supplyCost :'10000',          // 공급가액
        tax : '1000',                  // 세액
        remark : '비고'
      },
      {
        serialNum : 2,                // 품목 일련번호 1부터 순차기재
        itemName : '품명2',
        purchaseDT : '20161115',      // 구매일자
        qty : '1',                    // 수량
        unitCost : '10000',           // 단가
        spec : '규격',                 // 규격
        supplyCost :'10000',          // 공급가액
        tax : '1000',                  // 세액
        remark : '비고'
      }
    ],


    /**************************************************************************
    *                               전자명세서 추가속성
    * - 추가속성에 관한 자세한 사항은 "[전자명세서 API 연동매뉴얼] >
    *   5.2. 기본양식 추가속성 테이블"을 참조하시기 바랍니다.
    **************************************************************************/

    propertyBag : {
      Balance : '2000',     // 전잔액
      Deposit : '500',      // 입금액
      CBalance : '2500'     // 현잔액
    }
  };

  statementService.registIssue(testCorpNum, statement,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 1건의 전자명세서를 임시저장합니다.
*/
router.get('/register', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var ItemCode = 121;

  // 문서관리번호, 1~24자리 영문, 숫자, '-', '_' 조합으로 구성, 사업자별로 중복되지 않도록 구성
  var MgtKey = '20161115-07';

  // 전자명세서 정보
  var statement = {

    // [필수] 기재상 작성일자, 날짜형식(yyyyMMdd)
    writeDate : '20161115',

    // [필수] 영수, 청구 중 기재
    purposeType : '영수',

    // [필수] 과세형태, 과세, 영세, 면세 중 기재
    taxType : '과세',

    // 맞춤양식코드, 미기재시 기본양식으로 작성
    formCode : '',

    // [필수] 명세서 코드
    itemCode : ItemCode,

    // [필수] 문서관리번호
    mgtKey : MgtKey,

    /**************************************************************************
    *                             공급자 정보
    **************************************************************************/

    // 공급자 사업자번호
    senderCorpNum : testCorpNum,

    // 공급자 상호
    senderCorpName : '공급자 상호',

    // 공급자 주소
    senderAddr : '공급자 주소',

    // 공급자 대표자 성명
    senderCEOName : '공급자 대표자 성명',

    // 종사업장 식별번호, 필요시기재, 형식은 숫자 4자리
    senderTaxRegID : '',

    // 공급자 종목
    senderBizClass : '종목',

    // 공급자 업태
    senderBizType : '업태',

    // 공급자 담당자명
    senderContactName : '담당자명',

    // 공급자 메일주소
    senderEmail : 'test@test.com',

    // 공급자 연락처
    senderTEL : '070-4304-2991',

    // 공급자 휴대폰번호
    senderHP : '000-111-222',

    /**************************************************************************
    *                             공급받는자 정보
    **************************************************************************/

    // 공급받는자 사업자번호
    receiverCorpNum : '8888888888',

    // 공급받는자 상호
    receiverCorpName : '공급받는자상호',

    // 공급받는자 대표자 성명
    receiverCEOName : '공급받는자 대표자 성명',

    // 공급받는자 주소
    receiverAddr : '공급받는자 주소',

    // 공급받는자 종사업장 식별번호, 필요시 기재
    recieverTaxRegID : '',

    // 공급받는자 종목
    receiverBizClass : '종목',

    // 공급받는자 업태
    receiverBizType : '업태',

    // 공급받는자 담당자명
    receiverContactName : '공급받는자 담당자 성명',

    // 공급받는자 메일주소
    receiverEmail : 'test@test.com',

    // 공급받는자 연락처
    receiverTEL : '070-1111-2222',

    // 공급받는자 휴대폰 번호
    receiverHP : '000111222',

    /**************************************************************************
    *                            전자명세서 기재정보
    **************************************************************************/

    // [필수] 공급가액 합계
    supplyCostTotal : '20000',

    // [필수] 세액 합계
    taxTotal : '2000',

    // [필수] 합계금액 (공급가액 합계+ 세액 합계)
    totalAmount : '22000',

    // 기재 상 '일련번호' 항목
    serialNum : '1',

    // 기재 상 '비고' 항목
    remark1 : '비고1',
    remark2 : '비고2',
    remark3 : '비고3',

    // 사업자등록증 이미지 첨부 여부
    businessLicenseYN : false,

    // 통장사본 이미지 첨부 여부
    bankBookYN : false,


    /**************************************************************************
    *                          상세9항목(품목) 정보
    **************************************************************************/

    detailList : [
      {
        serialNum : 1,                // 품목 일련번호 1부터 순차기재
        itemName : '품명',
        purchaseDT : '20161115',      // 구매일자
        qty : '1',                    // 수량
        unitCost : '10000',           // 단가
        spec : '규격',                 // 규격
        supplyCost :'10000',          // 공급가액
        tax : '1000',                  // 세액
        remark : '비고'
      },
      {
        serialNum : 2,                // 품목 일련번호 1부터 순차기재
        itemName : '품명2',
        purchaseDT : '20161115',      // 구매일자
        qty : '1',                    // 수량
        unitCost : '10000',           // 단가
        spec : '규격',                 // 규격
        supplyCost :'10000',          // 공급가액
        tax : '1000',                  // 세액
        remark : '비고'
      }
    ],


    /**************************************************************************
    *                               전자명세서 추가속성
    * - 추가속성에 관한 자세한 사항은 "[전자명세서 API 연동매뉴얼] >
    *   5.2. 기본양식 추가속성 테이블"을 참조하시기 바랍니다.
    **************************************************************************/

    propertyBag : {
      Balance : '2000',     // 전잔액
      Deposit : '500',      // 입금액
      CBalance : '2500'     // 현잔액
    }
  };

  statementService.register(testCorpNum, statement,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 1건의 전자명세서를 수정합니다.
* - [임시저장] 상태의 전자명세서만 수정할 수 있습니다.
*/
router.get('/update', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var ItemCode = 121;

  // 문서관리번호
  var MgtKey = '20161115-04';


  // 전자명세서 정보
  var statement = {

    // [필수] 기재상 작성일자, 날짜형식(yyyyMMdd)
    writeDate : '20161115',

    // [필수] 영수, 청구 중 기재
    purposeType : '영수',

    // [필수] 과세형태, 과세, 영세, 면세 중 기재
    taxType : '과세',

    // 맞춤양식코드, 미기재시 기본양식으로 작성
    formCode : '',

    // [필수] 명세서 코드
    itemCode : ItemCode,

    // [필수] 문서관리번호
    mgtKey : MgtKey,

    /**************************************************************************
    *                             공급자 정보
    **************************************************************************/

    // 공급자 사업자번호
    senderCorpNum : testCorpNum,

    // 공급자 상호
    senderCorpName : '공급자 상호_수정',

    // 공급자 주소
    senderAddr : '공급자 주소_수정',

    // 공급자 대표자 성명
    senderCEOName : '공급자 대표자 성명',

    // 종사업장 식별번호, 필요시기재, 형식은 숫자 4자리
    senderTaxRegID : '',

    // 공급자 종목
    senderBizClass : '종목',

    // 공급자 업태
    senderBizType : '업태',

    // 공급자 담당자명
    senderContactName : '담당자명',

    // 공급자 메일주소
    senderEmail : 'test@test.com',

    // 공급자 연락처
    senderTEL : '070-4304-2991',

    // 공급자 휴대폰번호
    senderHP : '000-111-222',

    /**************************************************************************
    *                             공급받는자 정보
    **************************************************************************/

    // 공급받는자 사업자번호
    receiverCorpNum : '8888888888',

    // 공급받는자 상호
    receiverCorpName : '공급받는자상호',

    // 공급받는자 대표자 성명
    receiverCEOName : '공급받는자 대표자 성명',

    // 공급받는자 주소
    receiverAddr : '공급받는자 주소',

    // 공급받는자 종사업장 식별번호, 필요시 기재
    recieverTaxRegID : '',

    // 공급받는자 종목
    receiverBizClass : '종목',

    // 공급받는자 업태
    receiverBizType : '업태',

    // 공급받는자 담당자명
    receiverContactName : '공급받는자 담당자 성명',

    // 공급받는자 메일주소
    receiverEmail : 'test@test.com',

    // 공급받는자 연락처
    receiverTEL : '070-1111-2222',

    // 공급받는자 휴대폰 번호
    receiverHP : '000111222',

    /**************************************************************************
    *                            전자명세서 기재정보
    **************************************************************************/

    // [필수] 공급가액 합계
    supplyCostTotal : '20000',

    // [필수] 세액 합계
    taxTotal : '2000',

    // [필수] 합계금액 (공급가액 합계+ 세액 합계)
    totalAmount : '22000',

    // 기재 상 '일련번호' 항목
    serialNum : '1',

    // 기재 상 '비고' 항목
    remark1 : '비고1',
    remark2 : '비고2',
    remark3 : '비고3',

    // 사업자등록증 이미지 첨부 여부
    businessLicenseYN : false,

    // 통장사본 이미지 첨부 여부
    bankBookYN : false,


    /**************************************************************************
    *                          상세9항목(품목) 정보
    **************************************************************************/

    detailList : [
      {
        serialNum : 1,                // 품목 일련번호 1부터 순차기재
        itemName : '품명',
        purchaseDT : '20161115',      // 구매일자
        qty : '1',                    // 수량
        unitCost : '10000',           // 단가
        spec : '규격',                 // 규격
        supplyCost :'10000',          // 공급가액
        tax : '1000',                  // 세액
        remark : '비고'
      },
      {
        serialNum : 2,                // 품목 일련번호 1부터 순차기재
        itemName : '품명2',
        purchaseDT : '20161115',      // 구매일자
        qty : '1',                    // 수량
        unitCost : '10000',           // 단가
        spec : '규격',                 // 규격
        supplyCost :'10000',          // 공급가액
        tax : '1000',                  // 세액
        remark : '비고'
      }
    ],


    /**************************************************************************
    *                               전자명세서 추가속성
    * - 추가속성에 관한 자세한 사항은 "[전자명세서 API 연동매뉴얼] >
    *   5.2. 기본양식 추가속성 테이블"을 참조하시기 바랍니다.
    **************************************************************************/

    propertyBag : {
      Balance : '2000',     // 전잔액
      Deposit : '500',      // 입금액
      CBalance : '2500'     // 현잔액
    }
  };

  statementService.update(testCorpNum, ItemCode, MgtKey, statement,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 1건의 전자명세서 상태/요약 정보를 확인합니다.
* - 응답항목에 대한 자세한 정보는 "[전자명세서 API 연동매뉴얼] > 3.3.1.
*   GetInfo (상태 확인)"을 참조하시기 바랍니다.
*/
router.get('/getInfo', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.getInfo(testCorpNum, itemCode, mgtKey, testUserID,
    function(result) {
      res.render('Statement/StatementInfo',{path : req.path, result : result});
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 다수건의 전자명세서 상태/요약 정보를 확인합니다. (최대 1000건)
* - 응답항목에 대한 자세한 정보는 "[전자명세서 API 연동매뉴얼] > 3.3.2.
*   GetInfos (상태 대량 확인)"을 참조하시기 바랍니다.
*/
router.get('/getInfos', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호 배열, 최대 1000건
  var mgtKeyList = ['20161115-07', '20150813-01', '20150813-02', '20150813-03', '20161115-01'];

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.getInfos(testCorpNum, itemCode, mgtKeyList, testUserID,
    function(result) {
      res.render('Statement/StatementInfos',{path : req.path, result : result});
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 전자명세서 1건의 상세정보를 조회합니다.
* - 응답항목에 대한 자세한 사항은 "[전자명세서 API 연동매뉴얼] > 4.1.
*   전자명세서 구성" 을 참조하시기 바랍니다.
*/
router.get('/getDetailInfo', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.getDetailInfo(testCorpNum, itemCode, mgtKey, testUserID,
    function(result) {
      res.render('Statement/StatementDetail',{path : req.path, result : result});
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 1건의 전자명세서를 삭제합니다.
* - 전자명세서를 삭제하면 사용된 문서관리번호(mgtKey)를 재사용할 수 있습니다.
* - 삭제가능한 문서 상태 : [임시저장], [발행취소]
*/
router.get('/delete', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-04';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.delete(testCorpNum, itemCode, mgtKey, testUserID,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 전자명세서 상태 변경이력을 확인합니다.
* - 상태 변경이력 확인(GetLogs API) 응답항목에 대한 자세한 정보는
*   "[전자명세서 API 연동매뉴얼] > 3.3.4 GetLogs (상태 변경이력 확인)"
*   을 참조하시기 바랍니다.
*/
router.get('/getLogs', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.getLogs(testCorpNum, itemCode, mgtKey, testUserID,
    function(result) {
      res.render('Statement/StatementLogs', {path : req.path, result : result});
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});


/**
* 전자명세서에 첨부파일을 등록합니다.
* - 첨부파일 등록은 전자명세서가 [임시저장] 상태인 경우에만 가능합니다.
* - 첨부파일은 최대 5개까지 등록할 수 있습니다.
*/
router.get('/attachFile', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 파일경로
  var filePaths = ['../테스트.jpg'];

  // 파일명
  var fileName = filePaths[0].replace(/^.*[\\\/]/, '');

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.attachFile(testCorpNum, itemCode, mgtKey, fileName, filePaths, testUserID,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 전자명세서에 첨부된 파일의 목록을 확인합니다.
* - 응답항목 중 파일아이디(AttachedFile) 항목은 파일삭제(DeleteFile API)
*   호출시 이용할 수 있습니다.
*/
router.get('/getFiles', function(req,res,next) {

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  statementService.getFiles(testCorpNum, itemCode, mgtKey,
    function(result) {
      res.render('Statement/AttachedFile', { path : req.path, result : result});
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

/**
* 전자명세서에 첨부된 파일의 목록을 확인합니다.
* - 응답항목 중 파일아이디(AttachedFile) 항목은 파일삭제(DeleteFile API)
*   호출시 이용할 수 있습니다.
*/
router.get('/deleteFile', function(req,res,next) {

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 파일아이디 getFiles API의 attachedFile 변수값
  var fileID = '8BE66DF7-8A55-400D-8383-6FB905EF6517.PBF';

  statementService.deleteFile(testCorpNum, itemCode, mgtKey,fileID,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 1건의 [임시저장] 상태의 전자명세서를 발행처리합니다.
*/
router.get('/issue', function(req,res,next) {

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 메모
  var memo = '발행메모';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.issue(testCorpNum, itemCode, mgtKey, memo, testUserID,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 1건의 전자명세서를 [발행취소] 처리합니다.
*/
router.get('/cancelIssue', function(req,res,next){

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 메모
  var memo = '발행취소 메모';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.cancel(testCorpNum,itemCode, mgtKey, memo, testUserID,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 발행 안내메일을 재전송합니다.
*/
router.get('/sendEmail', function(req,res,next){

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 수신메일주소
  var receiver = 'test@test.com';

  statementService.sendEmail(testCorpNum, itemCode, mgtKey, receiver,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 알림문자를 전송합니다. (단문/SMS- 한글 최대 45자)
* - 알림문자 전송시 포인트가 차감됩니다. (전송실패시 환불처리)
* - 전송내역 확인은 "팝빌 로그인" > [문자 팩스] > [전송내역] 탭에서
*   전송결과를 확인할 수 있습니다.
*/
router.get('/sendSMS', function(req,res,next) {

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 발신번호
  var senderNum = '07043042991';

  // 수신번호
  var receiverNum = '010111222';

  // 문자메시지 내용, 최대 90Byte 초과시 길이가 조정되어 전송됨
  var contents = '전자명세서 알림문자재전송 테스트';

  statementService.sendSMS(testCorpNum, itemCode, mgtKey, senderNum, receiverNum, contents,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 전자명세서를 팩스전송합니다.
* - 팩스 전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
* - 전송내역 확인은 "팝빌 로그인" > [문자 팩스] > [팩스] > [전송내역]
*   메뉴에서 전송결과를 확인할 수 있습니다.
*/
router.get('/sendFAX', function(req,res,next) {

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 발신번호
  var senderNum = '07043042991';

  // 수신팩스번호
  var receiverNum = '010111222';

  statementService.sendFAX(testCorpNum, itemCode, mgtKey, senderNum, receiverNum,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 팝빌에 전자명세서를 등록하지 않고 공급받는자에게 팩스전송합니다.
* - 팩스 전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
* - 전송내역 확인은 "팝빌 로그인" > [문자 팩스] > [팩스] > [전송내역]
*   메뉴에서 전송결과를 확인할 수 있습니다.
*/
router.get('/FAXSend', function(req,res,next){

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 발신번호
  var sendNum = '07043042991';

  // 수신팩스번호
  var receiveNum = '010111222';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var ItemCode = 121;

  // 문서관리번호, 1~24자리 영문, 숫자, '-', '_' 조합으로 구성, 사업자별로 중복되지 않도록 생성
  var MgtKey = '20161115-08';

  // 전자명세서 정보
  var statement = {

    // [필수] 기재상 작성일자, 날짜형식(yyyyMMdd)
    writeDate : '20161115',

    // [필수] 영수, 청구 중 기재
    purposeType : '영수',

    // [필수] 과세형태, 과세, 영세, 면세 중 기재
    taxType : '과세',

    // 맞춤양식코드, 미기재시 기본양식으로 작성
    formCode : '',

    // [필수] 명세서 코드
    itemCode : ItemCode,

    // [필수] 문서관리번호
    mgtKey : MgtKey,

    /**************************************************************************
    *                             공급자 정보
    **************************************************************************/

    // 공급자 사업자번호
    senderCorpNum : testCorpNum,

    // 공급자 상호
    senderCorpName : '공급자 상호',

    // 공급자 주소
    senderAddr : '공급자 주소',

    // 공급자 대표자 성명
    senderCEOName : '공급자 대표자 성명',

    // 종사업장 식별번호, 필요시기재, 형식은 숫자 4자리
    senderTaxRegID : '',

    // 공급자 종목
    senderBizClass : '종목',

    // 공급자 업태
    senderBizType : '업태',

    // 공급자 담당자명
    senderContactName : '담당자명',

    // 공급자 메일주소
    senderEmail : 'test@test.com',

    // 공급자 연락처
    senderTEL : '070-4304-2991',

    // 공급자 휴대폰번호
    senderHP : '000-111-222',

    /**************************************************************************
    *                             공급받는자 정보
    **************************************************************************/

    // 공급받는자 사업자번호
    receiverCorpNum : '8888888888',

    // 공급받는자 상호
    receiverCorpName : '공급받는자상호',

    // 공급받는자 대표자 성명
    receiverCEOName : '공급받는자 대표자 성명',

    // 공급받는자 주소
    receiverAddr : '공급받는자 주소',

    // 공급받는자 종사업장 식별번호, 필요시 기재
    recieverTaxRegID : '',

    // 공급받는자 종목
    receiverBizClass : '종목',

    // 공급받는자 업태
    receiverBizType : '업태',

    // 공급받는자 담당자명
    receiverContactName : '공급받는자 담당자 성명',

    // 공급받는자 메일주소
    receiverEmail : 'test@test.com',

    // 공급받는자 연락처
    receiverTEL : '070-1111-2222',

    // 공급받는자 휴대폰 번호
    receiverHP : '000111222',

    /**************************************************************************
    *                            전자명세서 기재정보
    **************************************************************************/

    // [필수] 공급가액 합계
    supplyCostTotal : '20000',

    // [필수] 세액 합계
    taxTotal : '2000',

    // [필수] 합계금액 (공급가액 합계+ 세액 합계)
    totalAmount : '22000',

    // 기재 상 '일련번호' 항목
    serialNum : '1',

    // 기재 상 '비고' 항목
    remark1 : '비고1',
    remark2 : '비고2',
    remark3 : '비고3',

    // 사업자등록증 이미지 첨부 여부
    businessLicenseYN : false,

    // 통장사본 이미지 첨부 여부
    bankBookYN : false,


    /**************************************************************************
    *                          상세9항목(품목) 정보
    **************************************************************************/

    detailList : [
      {
        serialNum : 1,                // 품목 일련번호 1부터 순차기재
        itemName : '품명',
        purchaseDT : '20161115',      // 구매일자
        qty : '1',                    // 수량
        unitCost : '10000',           // 단가
        spec : '규격',                 // 규격
        supplyCost :'10000',          // 공급가액
        tax : '1000',                  // 세액
        remark : '비고'
      },
      {
        serialNum : 2,                // 품목 일련번호 1부터 순차기재
        itemName : '품명2',
        purchaseDT : '20161115',      // 구매일자
        qty : '1',                    // 수량
        unitCost : '10000',           // 단가
        spec : '규격',                 // 규격
        supplyCost :'10000',          // 공급가액
        tax : '1000',                  // 세액
        remark : '비고'
      }
    ],


    /**************************************************************************
    *                               전자명세서 추가속성
    * - 추가속성에 관한 자세한 사항은 "[전자명세서 API 연동매뉴얼] >
    *   5.2. 기본양식 추가속성 테이블"을 참조하시기 바랍니다.
    **************************************************************************/

    propertyBag : {
      Balance : '2000',     // 전잔액
      Deposit : '500',      // 입금액
      CBalance : '2500'     // 현잔액
    }
  };

  statementService.FAXSend(testCorpNum, statement, sendNum, receiveNum,
    function(receiptNum){
      res.render('result', { path : req.path, result : receiptNum });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 팝빌 전자명세서 문서함 관련 팝업 URL을 반환합니다.
* 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
*/
router.get('/getURL', function(req,res,next) {

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // SBOX(매출문서함), TBOX(임시문서함)
  var TOGO = 'SBOX';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.getURL(testCorpNum, TOGO, testUserID,
    function(url) {
      res.render('result', { path : req.path, result : url });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 1건의 전자명세서 보기 팝업 URL을 반환합니다.
* - 보안정책으로 인해 반환된 URL의 유효시간은 30초입니다.
*/
router.get('/getPopUpURL', function(req,res,next) {

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.getPopUpURL(testCorpNum, itemCode, mgtKey, testUserID,
    function(url) {
      res.render('result', { path : req.path, result : url });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 1건의 전자명세서 인쇄팝업 URL을 반환합니다.
* - 보안정책으로 인해 반환된 URL의 유효시간은 30초입니다.
*/
router.get('/getPrintURL', function(req,res,next) {

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.getPrintURL(testCorpNum, itemCode, mgtKey, testUserID,
    function(url) {
      res.render('result', { path : req.path, result : url });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 다수건의 전자명세서 인쇄팝업 URL을 반환합니다. (최대 100건)
* - 보안정책으로 인해 반환된 URL의 유효시간은 30초입니다.
*/
router.get('/getMassPrintURL', function(req,res,next){

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호 배열, 최대 100건
  var mgtKeyList = ['20161115-07', '20150813-15', '20150810-07', '20150810-08']

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.getMassPrintURL(testCorpNum, itemCode, mgtKeyList, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 1건의 전자명세서 인쇄팝업 URL을 반환합니다.
* - 보안정책으로 인해 반환된 URL의 유효시간은 30초입니다.
*/
router.get('/getEPrintURL', function(req,res,next) {

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.getEPrintURL(testCorpNum, itemCode, mgtKey, testUserID,
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

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 팝빌회원 아이디
  var testUserID = 'testkorea';

  statementService.getMailURL(testCorpNum, itemCode, mgtKey, testUserID,
    function(url) {
      res.render('result', { path : req.path, result : url });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 전자명세서 발행단가를 확인합니다.
*/
router.get('/getUnitCost', function(req,res,next) {

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  statementService.getUnitCost(testCorpNum, itemCode,
    function(unitCost) {
      res.render('result', { path : req.path, result : unitCost });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 검색조건을 사용하여 전자명세서 목록을 조회합니다.
* - 응답항목에 대한 자세한 사항은 "[전자명세서 API 연동매뉴얼] >
*   3.3.3. Search (목록 조회)" 를 참조하시기 바랍니다.
*/
router.get('/search', function(req,res,next) {

  // 팝빌회원 사업자번호, '-' 제외 10자리
  var testCorpNum = '1234567890';

  // 검색일자 유형, R-등록일자, W-작성일자, I-발행일자
  var DType = 'W';

  // 시작일자, 작성형식(yyyyMMdd)
  var SDate = '20161001';

  // 종료일자, 작성형식(yyyyMMdd)
  var EDate = '20161131';


  // 명세서 문서상태값 배열, 전송상태(stateCode)값 배열
  var State = ['200','3**'];

  // 전자명세서 종류코드 배열, 121-거래명세서, 122-청구서, 123-견적서, 124-발주서, 125-입금표, 126-영수증
  var ItemCode = [121, 122, 123, 124, 125, 126];

  // 거래처 정보, 거래처 상호 또는 사업자등록번호 기재, 미기재시 전체조회
  var QString = '';

  // 정렬방향, D-내림차순, A-오름차순
  var Order = 'D';

  // 페이지 번호
  var Page = 1;

  // 페이지당 검색개수, 최대 1000건
  var PerPage = 10;

  statementService.search(testCorpNum, DType, SDate, EDate, State, ItemCode, QString, Order, Page, PerPage,
    function(result) {
      res.render('Statement/Search', {path : req.path, result : result});
    }, function(Error) {
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});


/**
* 전자명세서에 다른 전자명세서 1건을 첨부합니다.
*/
router.get('/attachStatement', function(req,res,next) {

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 종류코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 첨부할 명세서 종류코드
  var subItemCode = 121;

  // 첨부할 명세서 문서관리번호
  var subMgtKey = '20160317-02';

  statementService.attachStatement(testCorpNum, itemCode, mgtKey, subItemCode, subMgtKey,
    function(result) {
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error) {
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


/**
* 전자명세서에 첨부된 다른 전자명세서를 첨부해제합니다.
*/
router.get('/detachStatement', function(req,res,next){

  // 팝빌회원 사업자번호
  var testCorpNum = '1234567890';

  // 명세서 종류코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var itemCode = 121;

  // 문서관리번호
  var mgtKey = '20161115-07';

  // 첨부해제할 명세서 종류코드
  var subItemCode = 121;

  // 첨부해제할 명세서 문서관리번호
  var subMgtKey = '20160317-02';

  statementService.detachStatement(testCorpNum, itemCode, mgtKey, subItemCode, subMgtKey,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


module.exports = router;
