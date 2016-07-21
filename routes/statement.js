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

// 전자명세서 API 모듈 초기화
var statementService = popbill.StatementService();

// API List Index
router.get('/', function(req, res, next) {
  res.render('Statement/index', {});
});

// 아이디 중복 확인
router.get('/checkID', function (req, res, next){
  var testID = 'testkorea';  // 조회할 아이디

  statementService.checkID(testID,
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

  statementService.listContact(testCorpNum,
    function(result){
      res.render('Base/listContact', { path: req.path, result : result});
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 과금정보 확인
router.get('/getChargeInfo', function (req, res, next){
  var testCorpNum = '1234567890';  // 팝빌회원 사업자번호, '-' 제외 10자리
  var itemCode = 121;              // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var testUserID = 'testkorea';    // 팝빌회원 아이디

  statementService.getChargeInfo(testCorpNum, itemCode, testUserID,
    function(result){
      res.render('Base/getChargeInfo', { path: req.path, result : result});
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

  statementService.updateContact(testCorpNum, testUserID, contactInfo,
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

  statementService.registContact(testCorpNum, testUserID, contactInfo,
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

  statementService.getCorpInfo(testCorpNum,
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

  statementService.updateCorpInfo(testCorpNum, testUserID, corpInfo,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', { path: req.path, code : Error.code, message : Error.message});
    }
  );
});

// 연동회원 가입여부 확인
router.get('/checkIsMember', function(req, res, next) {

  var testCorpNum = '1234567890';   // 조회할 사업자번호, '-' 제외 10자리

  statementService.checkIsMember(testCorpNum,
    function(result){
      res.render('response', { path: req.path, code: result.code, message : result.message });
    }, function(Error){
      res.render('response', {code : Error.code, message : Error.message});
  });
});

// 회원가입 요청
router.get('/joinMember', function(req,res,next) {

  // 가입정보
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
    ContactTEL : '070-1111-2222',
    ID : 'userid',
    PWD : 'this_is_password'
  };

  statementService.joinMember(joinInfo,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 연동회원 잔여포인트 조회
router.get('/getBalance', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리

  statementService.getBalance(testCorpNum,
    function(remainPoint){
      res.render('result', {path : req.path, result : remainPoint})
    }, function(Error){
      res.render('response', {path : req.path, code: Error.code, message :Error.message});
  });
});

// 파트너 잔여포인트 조회
router.get('/getPartnerBalance', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리

  statementService.getPartnerBalance(testCorpNum,
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

  statementService.getPopbillURL(testCorpNum, testUserID, TOGO,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// 문서관리번호 사용여부 확인
router.get('/checkMgtKeyInUse', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var itemCode = 121;                // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-01';        // 문서관리번호

  statementService.checkMgtKeyInUse(testCorpNum, itemCode, mgtKey,
    function(result){
      if(result){
        res.render('result', {path : req.path, result : '사용중'});
      } else{
        res.render('result', {path : req.path, result : '미사용중'});
      }
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
  });
});

// 전자명세서 즉시발행
router.get('/registIssue', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var ItemCode = 121;                // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var MgtKey = '20160317-02';        // 문서관리번호, 1~24자리 영문, 숫자, '-', '_' 조합으로 구성, 사업자별로 중복되지 않도록 생성

  var statement = {
    writeDate : '20160317',          // [필수] 기재상 작성일자
    purposeType : '영수',             // [필수] 영수, 청구 중 기재
    taxType : '과세',                 // [필수] 과세, 영세, 면세 중 기재
    formCode : '',                   // 맞춤양식코드, 미기재시 기본양식으로 작성
    itemCode : ItemCode,             // [필수] 명세서 코드
    mgtKey : MgtKey,                 // [필수] 문서관리번호
    senderCorpNum : testCorpNum,     // 공급자 사업자번호
    senderCorpName : '공급자 상호',
    senderAddr : '공급자 주소',
    senderCEOName : '공급자 대표자 성명',
    senderTaxRegID : '',              // 종사업장 식별번호, 필요시기재, 형식은 숫자 4자리
    senderBizClass : '업종',
    senderBizType : '업태',
    senderContactName : '담당자명',
    senderEmail : 'test@test.com',
    senderTEL : '070-7510-3710',
    senderHP : '000-111-222',

    receiverCorpNum : '8888888888',   // 공급받는자 사업자번호
    receiverCorpName : '공급받는자상호',
    receiverCEOName : '공급받는자 대표자 성명',
    receiverAddr : '공급받는자 주소',
    recieverTaxRegID : '',            // 공급받는자 종사업장 식별번호, 필요시 기재
    receiverBizClass : '업종',
    receiverBizType : '업태',
    receiverContactName : '공급받는자 담당자 성명',
    receiverEmail : 'test@test.com',
    receiverTEL : '070-1111-2222',
    receiverHP : '000111222',

    supplyCostTotal : '20000',        // [필수] 공급가액 합계
    taxTotal : '2000',                // [필수] 세액 합계
    totalAmount : '22000',            // [필수] 합계금액 (공급가액 합계+ 세액 합계)
    serialNum : '1',                  // 기재상 일련번호 항목
    remark1 : '비고1',
    remark2 : '비고2',
    remark3 : '비고3',
    businessLicenseYN : false,        // 사업자등록증 첨부 여부
    bankBookYN : false,               // 통장사본 첨부 여부

    // 품목배열
    detailList : [
      {
        serialNum : 1,                // 품목 일련번호 1부터 순차기재
        itemName : '품명',
        purchaseDT : '20150803',      // 구매일자
        qty : '1',                    // 수량
        unitCost : '20000',           // 단가
        spec : '규격',                 // 규격
        supplyCost :'20000',          // 공급가액
        tax : '2000',                  // 세액
        remark : '비고'
      },
      {
        serialNum : 2,
        itemName : '품명2'
      }
    ],

    // 추가속성, 자세한사항은 전자명세서 API 연동매뉴얼 [5.부록>5.2 기본양식 추가속성 테이블] 참조.
    propertyBag : {
      Balance : '2000',     // 전잔액
      Deposit : '500',      // 입금액
      CBalance : '2500'     // 현잔액
    }
  };

  statementService.registIssue(testCorpNum, statement,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 전자명세서 임시저장
router.get('/register', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var ItemCode = 121;                // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var MgtKey = '20150813-17';        // 문서관리번호, 1~24자리 영문, 숫자, '-', '_' 조합으로 구성, 사업자별로 중복되지 않도록 생성

  var statement = {
    writeDate : '20150813',          // [필수] 기재상 작성일자
    purposeType : '영수',             // [필수] 영수, 청구 중 기재
    taxType : '과세',                 // [필수] 과세, 영세, 면세 중 기재
    formCode : '',                   // 맞춤양식코드, 미기재시 기본양식으로 작성
    itemCode : ItemCode,             // [필수] 명세서 코드
    mgtKey : MgtKey,                 // [필수] 문서관리번호
    senderCorpNum : testCorpNum,     // 공급자 사업자번호
    senderCorpName : '공급자 상호',
    senderAddr : '공급자 주소',
    senderCEOName : '공급자 대표자 성명',
    senderTaxRegID : '',              // 종사업장 식별번호, 필요시기재, 형식은 숫자 4자리
    senderBizClass : '업종',
    senderBizType : '업태',
    senderContactName : '담당자명',
    senderEmail : 'test@test.com',
    senderTEL : '070-7510-3710',
    senderHP : '000-111-222',

    receiverCorpNum : '8888888888',   // 공급받는자 사업자번호
    receiverCorpName : '공급받는자상호',
    receiverCEOName : '공급받는자 대표자 성명',
    receiverAddr : '공급받는자 주소',
    recieverTaxRegID : '',            // 공급받는자 종사업장 식별번호, 필요시 기재
    receiverBizClass : '업종',
    receiverBizType : '업태',
    receiverContactName : '공급받는자 담당자 성명',
    receiverEmail : 'test@test.com',
    receiverTEL : '070-1111-2222',
    receiverHP : '000111222',

    supplyCostTotal : '20000',        // [필수] 공급가액 합계
    taxTotal : '2000',                // [필수] 세액 합계
    totalAmount : '22000',            // [필수] 합계금액 (공급가액 합계+ 세액 합계)
    serialNum : '1',                  // 기재상 일련번호 항목
    remark1 : '비고1',
    remark2 : '비고2',
    remark3 : '비고3',
    businessLicenseYN : false,        // 사업자등록증 첨부 여부
    bankBookYN : false,               // 통장사본 첨부 여부

    // 품목배열
    detailList : [
      {
        serialNum : 1,                // 품목 일련번호 1부터 순차기재
        itemName : '품명',
        purchaseDT : '20150803',      // 구매일자
        qty : '1',                    // 수량
        unitCost : '20000',           // 단가
        spec : '규격',                 // 규격
        supplyCost :'20000',          // 공급가액
        tax : '2000',                  // 세액
        remark : '비고'
      },
      {
        serialNum : 2,
        itemName : '품명2'
      }
    ],

    // 추가속성, 자세한사항은 전자명세서 API 연동매뉴얼 [5.부록>5.2 기본양식 추가속성 테이블] 참조.
    propertyBag : {
      Balance : '2000',     // 전잔액
      Deposit : '500',      // 입금액
      CBalance : '2500'     // 현잔액
    }
  };

  statementService.register(testCorpNum, statement,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 전자명세서 수정
router.get('/update', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호, '-' 제외 10자리
  var ItemCode = 121;               // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var MgtKey = '20150813-02';       // 문서관리번호

  var statement = {
    writeDate : '20150813',          // [필수] 기재상 작성일자
    purposeType : '영수',             // [필수] 영수, 청구 중 기재
    taxType : '과세',                 // [필수] 과세, 영세, 면세 중 기재
    formCode : '',                   // 맞춤양식코드, 미기재시 기본양식으로 작성
    itemCode : ItemCode,             // [필수] 명세서 코드
    mgtKey : MgtKey,                 // [필수] 문서관리번호
    senderCorpNum : testCorpNum,    // 공급자 사업자번호
    senderCorpName : '공급자 상호',
    senderAddr : '공급자 주소',
    senderCEOName : '공급자 대표자 성명_수정',
    senderTaxRegID : '',              // 종사업장 식별번호, 필요시기재, 형식은 숫자 4자리
    senderBizClass : '업종',
    senderBizType : '업태',
    senderContactName : '담당자명',
    senderEmail : 'test@test.com',
    senderTEL : '070-7510-3710',
    senderHP : '000-111-222',

    receiverCorpNum : '8888888888',   // 공급받는자 사업자번호
    receiverCorpName : '공급받는자상호',
    receiverCEOName : '공급받는자 대표자 성명_수정',
    receiverAddr : '공급받는자 주소',
    recieverTaxRegID : '',            // 공급받는자 종사업장 식별번호, 필요시 기재
    receiverBizClass : '업종',
    receiverBizType : '업태',
    receiverContactName : '공급받는자 담당자 성명',
    receiverEmail : 'test@test.com',
    receiverTEL : '070-1111-2222',
    receiverHP : '000111222',

    supplyCostTotal : '20000',        // [필수] 공급가액 합계
    taxTotal : '2000',                // [필수] 세액 합계
    totalAmount : '22000',            // [필수] 합계금액 (공급가액 합계+ 세액 합계)
    serialNum : '1',                  // 기재상 일련번호 항목
    remark1 : '비고1',
    remark2 : '비고2',
    remark3 : '비고3',
    businessLicenseYN : false,        // 사업자등록증 첨부 여부
    bankBookYN : false,               // 통장사본 첨부 여부

    // 품목배열
    detailList : [
      {
        serialNum : 1,                // 품목 일련번호 1부터 순차기재
        itemName : '품명',
        purchaseDT : '20150803',      // 구매일자
        unitCost : '20000',           // 단가
        qty : '1',                    // 수량
        spec : '규격',                 // 규격
        supplyCost :'20000',          // 공급가액
        tax : '2000',                  // 세액
        remark : '비고'
      },
      {
        serialNum : 2,
        itemName : '품명2'
      }
    ],

    // 추가속성, 자세한사항은 전자명세서 API 연동매뉴얼 [5.부록>5.2 기본양식 추가속성 테이블] 참조.
    propertyBag : {
      Balance : '2000',     // 전잔액
      Deposit : '500',      // 입금액
      CBalance : '2500'     // 현잔액
    }
  };

  statementService.update(testCorpNum, ItemCode, MgtKey, statement,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 전자명세서 상태/요약정보 확인
router.get('/getInfo', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호, '-' 제외 10자리
  var itemCode = 121;               // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-10';       // 문서관리번호
  var testUserID = 'testkorea';     // 팝빌회원 아이디

  statementService.getInfo(testCorpNum, itemCode, mgtKey, testUserID,
    function(result){
      res.render('Statement/StatementInfo',{path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 전자명세서 상태/요약정보 다량 확인
router.get('/getInfos', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호, '-' 제외 10자리
  var itemCode = 121;                // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKeyList = ['20150813-01', '20150813-02', '20150813-03'];  // 문서관리번호 배열
  var testUserID = 'testkorea';      // 팝빌회원 아이디

  statementService.getInfos(testCorpNum, itemCode, mgtKeyList, testUserID,
    function(result){
      res.render('Statement/StatementInfos',{path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 전자명세서 상세정보 확인
router.get('/getDetailInfo', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호, '-' 제외 10자리
  var itemCode = 121;               // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-15';       // 문서관리번호
  var testUserID = 'testkorea';     // 팝빌회원 아이디

  statementService.getDetailInfo(testCorpNum, itemCode, mgtKey, testUserID,
    function(result){
      res.render('Statement/StatementDetail',{path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 전자명세서 삭제
router.get('/delete', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호, '-' 제외 10자리
  var itemCode = 121;               // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-03';       // 문서관리번호
  var testUserID = 'testkorea';     // 팝빌회원 아이디

  statementService.delete(testCorpNum, itemCode, mgtKey, testUserID,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 전자명세서 이력조회
router.get('/getLogs', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호, '-' 제외 10자리
  var itemCode = 121;               // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-15';       // 문서관리번호
  var testUserID = 'testkorea';     // 팝빌회원 아이디

  statementService.getLogs(testCorpNum, itemCode, mgtKey, testUserID,
    function(result){
      res.render('Statement/StatementLogs', {path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 전자명세서 파일첨부, 임시저장 상태만 가능
router.get('/attachFile', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호, '-' 제외 10자리
  var itemCode = 121;               // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-15';       // 문서관리번호
  var filePaths = ['../테스트.jpg'];  // 파일경로
  var fileName = filePaths[0].replace(/^.*[\\\/]/, ''); // 파일명
  var testUserID = 'testkorea';     // 팝빌회원 아이디

  statementService.attachFile(testCorpNum, itemCode, mgtKey, fileName, filePaths, testUserID,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 첨부파일 목록 확인
router.get('/getFiles', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호
  var itemCode = 121;                 // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-15';         // 문서관리번호

  statementService.getFiles(testCorpNum, itemCode, mgtKey,
    function(result){
      res.render('Statement/AttachedFile', { path : req.path, result : result});
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 첨부파일 삭제
router.get('/deleteFile', function(req,res,next){

  var testCorpNum = '1234567890';       // 팝빌회원 사업자번호
  var itemCode = 121;                   // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-15';           // 문서관리번호
  var fileID = '9217B0B8-BC81-4469-B359-2FB153A3C4DC.PBF';    // 파일아이디 getFiles API의 attachedFile 변수값

  statementService.deleteFile(testCorpNum, itemCode, mgtKey,fileID,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 발행
router.get('/issue', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호
  var itemCode = 121;                 // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-17';         // 문서관리번호
  var memo = '발행메모';                // 메모
  var testUserID = 'testkorea';       // 팝빌회원 아이디

  statementService.issue(testCorpNum, itemCode, mgtKey, memo, testUserID,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 발행취소
router.get('/cancelIssue', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호
  var itemCode = 121;                 // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-15';         // 문서관리번호
  var memo = '발행취소 메모';            // 메모
  var testUserID = 'testkorea';       // 팝빌회원 아이디

  statementService.cancel(testCorpNum,itemCode, mgtKey, memo, testUserID,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 알림메일 재전송
router.get('/sendEmail', function(req,res,next){

  var testCorpNum = '1234567890';      // 팝빌회원 사업자번호
  var itemCode = 121;                  // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-16';          // 문서관리번호
  var receiver = 'test@test.com';      // 수신자 메일주소

  statementService.sendEmail(testCorpNum, itemCode, mgtKey, receiver,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 알림문자전송
router.get('/sendSMS', function(req,res,next){

  var testCorpNum = '1234567890';         // 팝빌회원 사업자번호
  var itemCode = 121;                     // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-17';             // 문서관리번호
  var senderNum = '07075103710';             // 발신번호
  var receiverNum = '000111222';             // 수신번호
  var contents = '전자명세서 알림문자재전송 테스트';   // 문자메시지 내용, 최대길이 90Byte, 초과 길이가 조정되어 전송됨

  statementService.sendSMS(testCorpNum, itemCode, mgtKey, senderNum, receiverNum, contents,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 전자명세서 팩스전송
router.get('/sendFAX', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호
  var itemCode = 121;               // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-17';       // 문서관리번호
  var senderNum = '07075103710';    // 발신번호
  var receiverNum = '000111222';    // 수신팩스번호

  statementService.sendFAX(testCorpNum, itemCode, mgtKey, senderNum, receiverNum,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 전자명세서 팩스전송
router.get('/FAXSend', function(req,res,next){

  var testCorpNum = '1234567890';       // 팝빌회원 사업자번호
  var sendNum = '07071501730';          // 발신번호
  var receiveNum = '000111222';         // 수신팩스번호

  var statement = {
    writeDate : '20150315',             // 작성일자, 형식(yyyyMMdd)
    purposeType : '영수',                // 영수, 청구 중 기재
    taxType : '과세',                    // 과세, 영세, 면세 중 기재
    formCode : '',                      // 맞춤양식코드, 미기재시 기본양식으로 처리
    itemCode : 121,                     // 문서종류코드, 121-거래명세서, 122-청구서, 123-견적서, 124-발주서, 125-입금표, 126-영수증
    mgtKey : '20160315-01',             // 문서관리번호, 최대 24자, 숫자, 영문, -, _, 조합으로 사업자별로 중복되지 않도록 구성
    senderCorpNum : '1234567890',       // 발신자 사업자번호
    senderCorpName : '공급자 상호',        // 발신자 상호
    senderAddr : '공급자 주소',            // 발신자 수소
    senderCEOName : '공급자 대표자 성명',    // 발신자 대표자 성명
    senderTaxRegID : '',                 // 발신자 종사업장 식별번호
    senderBizClass : '종목',
    snederbizType : '업태',
    senderContactName : '담당자명',
    senderEmail : 'test@test.com',
    senderTEL : '070-7510-3710',
    senderHP : '000-111-222',
    receiverCorpNum : '8888888888',
    receiverCorpName : '공급받는자상호',
    receiverCEOName : '공급받는자 대표자 성명',
    receiverAddr : '공급받는자 주소',
    recieverTaxRegID : '',
    receiverBizClass : '업종',
    recieverBizType : '업태',
    receiverContactName : '공급받는자 담당자 성명',
    receiverEmail : 'test@test.com',
    receiverTEL : '',
    receiverHP : '',
    supplyCostTotal : '20000',            // 공급가액 합계
    taxTotal : '2000',                    // 세액 합계
    totalAmount : '22000',                // 합계금액 (공급가액 합계 + 세액 합계)
    serialNum : '1',                      // 기재 상, 일련번호 항목
    remark1 : '',                         // 기재 상, 비고1 항목
    remark2 : '',                         // 기재 상, 비고2 항목
    remark3 : '',                         // 기재 상, 비고3 항목
    businessLicenseYN : false,
    bankBookYN : false,

    detailList : [
      {
        serialNum : 1,                    // 품목 일련번호, 1부터 순차기재
        itemName : '품명',
        purchaseDT : '20160309',          // 거래일자
        qty : '1',                        // 수량
        spec : '규격',                     // 규격
        unitCost : '20000',                // 단가
        supplyCost :'20000',              // 공급가액
        tax : '2000'                      // 세액
      },
      {
        serialNum : 2,
        itemName : '품명2'
      }
    ],

    // 추가속성 전자세금계산서 5.2. 기본양식 추가속성 테이블 참조
    propertyBag : {
      Balance : '2000',
      Deposit : '500',
      CBalance : '2500'
    }
  };

  statementService.FAXSend(testCorpNum, statement, sendNum, receiveNum,
    function(receiptNum){
      res.render('result', { path : req.path, result : receiptNum });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

//전자명세서 관련 URL
router.get('/getURL', function(req,res,next){

  var testCorpNum = '1234567890'; // 팝빌회원 사업자번호
  var TOGO = 'SBOX';              // SBOX(매출문서함), TBOX(임시문서함)
  var testUserID = 'testkorea';   // 팝빌회원 아이디

  statementService.getURL(testCorpNum, TOGO, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 전자명세서 보기 팝업 URL
router.get('/getPopUpURL', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호
  var itemCode = 121;               // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-15';       // 문서관리번호
  var testUserID = 'testkorea';     // 팝빌회원 아이디

  statementService.getPopUpURL(testCorpNum, itemCode, mgtKey, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 인쇄 팝업 URL - 단건
router.get('/getPrintURL', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호
  var itemCode = 121;               // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-15';       // 문서관리번호
  var testUserID = 'testkorea';     // 팝빌회원 아이디

  statementService.getPrintURL(testCorpNum, itemCode, mgtKey, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 다량인쇄 팝업 URL(최대 100건)
router.get('/getMassPrintURL', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호
  var itemCode = 121;               // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKeyList = ['20150813-15', '20150810-07', '20150810-08']  // 문서관리번호 배열, 최대 100건
  var testUserID = 'testkorea';     // 팝빌회원 아이디

  statementService.getMassPrintURL(testCorpNum, itemCode, mgtKeyList, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 공급받는자 인쇄 팝업 URL
router.get('/getEPrintURL', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호
  var itemCode = 121;               // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-15';       // 문서관리번호
  var testUserID = 'testkorea';     // 팝빌회원 아이디

  statementService.getEPrintURL(testCorpNum, itemCode, mgtKey, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
    });
});

// 공급받는자 메일링크 URL
router.get('/getMailURL', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호
  var itemCode = 121;               // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20150813-15';       // 문서관리번호
  var testUserID = 'testkorea';     // 팝빌회원 아이디

  statementService.getMailURL(testCorpNum, itemCode, mgtKey, testUserID,
    function(url){
      res.render('result', { path : req.path, result : url });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 전자명세서 발행단가 확인
router.get('/getUnitCost', function(req,res,next){

  var testCorpNum = '1234567890';    // 팝빌회원 사업자번호
  var itemCode = 121;                // 명세서 코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)

  statementService.getUnitCost(testCorpNum, itemCode,
    function(unitCost){
      res.render('result', { path : req.path, result : unitCost });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 전자명세서 목록 조회
router.get('/search', function(req,res,next){

  var testCorpNum = '1234567890';         // 팝빌회원 사업자번호, '-' 제외 10자리
  var DType = 'R';                        // 검색일자 유형, R-등록일자, W-작성일자, I-발행일자
  var SDate = '20160101';                 // 시작일자, 작성형식(yyyyMMdd)
  var EDate = '20160317';                 // 종료일자, 작성형식(yyyyMMdd)

  var State = ['100','200','3**'];        // 전송상태값 배열, 전송상태(stateCode)값 배열

  // 전자명세서 종류코드 배열, 121-거래명세서, 122-청구서, 123-견적서, 124-발주서, 125-입금표, 126-영수증
  var ItemCode = [121, 122, 123, 124, 125, 126];

  var Order = 'A';                        // 정렬방향, D-내림차순, A-오름차순
  var Page = 1;                           // 페이지 번호
  var PerPage = 10;                       // 페이지당 검색개수, 최대 1000건

  statementService.search(testCorpNum, DType, SDate, EDate, State, ItemCode, Order, Page, PerPage,
    function(result){
      res.render('Statement/Search', {path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 다른 전자명세서 첨부
router.get('/attachStatement', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호
  var itemCode = 121;               // 명세서 종류코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20160317-01';       // 문서관리번호

  var subItemCode = 121;            // 첨부할 명세서 종류코드
  var subMgtKey = '20160317-02';    // 첨부할 명세서 문서관리번호

  statementService.attachStatement(testCorpNum, itemCode, mgtKey, subItemCode, subMgtKey,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});

// 다른 전자명세서 첨부해제
router.get('/detachStatement', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호
  var itemCode = 121;               // 명세서 종류코드 - 121(거래명세서), 122(청구서), 123(견적서) 124(발주서), 125(입금표), 126(영수증)
  var mgtKey = '20160317-01';       // 문서관리번호

  var subItemCode = 121;            // 첨부할 명세서 종류코드
  var subMgtKey = '20160317-02';    // 첨부할 명세서 문서관리번호

  statementService.detachStatement(testCorpNum, itemCode, mgtKey, subItemCode, subMgtKey,
    function(result){
      res.render('response', { path : req.path, code: result.code, message : result.message });
    },function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
  });
});


module.exports = router;
