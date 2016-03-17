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

// 전자세금계산서 API 모듈 초기화
var taxinvoiceService = popbill.TaxinvoiceService();

// API List Index
router.get('/', function(req, res, next) {
	res.render('Taxinvoice/index', {});
});

// 아이디 중복 확인
router.get('/checkID', function (req, res, next){
  var testID = 'testkorea';  // 조회할 아이디

  taxinvoiceService.checkID(testID,
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

  taxinvoiceService.listContact(testCorpNum,
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

  taxinvoiceService.updateContact(testCorpNum, testUserID, contactInfo,
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

  taxinvoiceService.registContact(testCorpNum, testUserID, contactInfo,
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

  taxinvoiceService.getCorpInfo(testCorpNum,
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

  taxinvoiceService.updateCorpInfo(testCorpNum, testUserID, corpInfo,
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

	taxinvoiceService.checkIsMember(testCorpNum,
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

	taxinvoiceService.joinMember(joinInfo,
		function(result){
			res.render('response', { path : req.path, code: result.code, message : result.message });
		},function(Error){
      res.render('response', {path : req.path,  code: Error.code, message : Error.message });
    });
});

// 연동회원 잔여포인트 조회
router.get('/getBalance', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리

  taxinvoiceService.getBalance(testCorpNum,
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

  taxinvoiceService.getPopbillURL(testCorpNum, testUserID, TOGO,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});

// 문서관리번호 사용여부확인
router.get('/checkMgtKeyInUse', function(req,res,next){

  var testCorpNum = '1234567890';   // 팝빌회원 사업자번호, '-' 제외 10자리
  var mgtKey = '20150813-01';       // 문서관리번호, 1~24자리 영문,숫자,'-','_' 조합으로 구성

  taxinvoiceService.checkMgtKeyInUse(testCorpNum,popbill.MgtKeyType.SELL,mgtKey,
    function(result){
      if(result){
        res.render('result', {path : req.path, result : '사용중'});
      } else{
        res.render('result', {path : req.path, result : '미사용중'});
      }
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 세금계산서 즉시발행
router.get('/registIssue', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';            // 팝빌회원 아이디
  var mgtKey = '20160317-01';              // 문서관리번호, 1~24자리 영문,숫자,'-','_' 조합으로 사업자별로 중복되지 않도록 구성

  // 세금계산서 항목
  var Taxinvoice = {
    writeDate : '20160317',             // [필수] 작성일자, 형태 yyyyMMdd
    chargeDirection : '정과금',           // [필수] 과금방향, (정과금, 역과금) 중 기재, 역과금은 역발행의 경우만 가능
    issueType : '정발행',                 // [필수] 발행형태, (정발행, 역발행, 위수탁) 중 기재
    purposeType : '영수',                // [필수] (영수, 청구) 중 기재
    issueTiming : '직접발행',             // [필수] 발행시점, (직접발행, 승인시자동발행) 중 기재
    taxType : '과세',                    // [필수] 과세형태, (과세, 영세, 면세) 중 기재

    invoicerCorpNum : '1234567890',     // [필수] 공급자 사업자번호, '-' 제외 10자리
    invoicerMgtKey : mgtKey,            // [정발행시 필수] 문서관리번호, 1~24자리 숫자,영문,'-','_' 조합으로 사업자별로
    invoicerTaxRegID : '1234',          // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
    invoicerCorpName : '공급자 상호',      // [필수]
    invoicerCEOName : '대표자 성명',       // [필수]
    invoicerAddr : '공급자 주소',
    invoicerBizClass : '공급자 업종',
    invoicerBizType : '공급자 업태',
    invoicerContactName : '공급자 담당자명',
    invoicerTEL : '070-7510-3710',
    invoicerHP : '010-000-111',
    invoicerEmail : 'test@test.com',
    invoicerSMSSendYN : false,          // 정발행시 알림문자 전송여부

    invoiceeType : '사업자',              // [필수] 공급받는자 구분, (사업자, 개인, 외국인) 기재
    invoiceeCorpNum : '8888888888',     // [필수] 공급받는자 사업자번호, '-'제외 10자리
    invoiceeMgtKey : '',                // 공급받는자 문서관리번호
    invoiceeTaxRegID : '',              // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
    invoiceeCorpName : '공급받는자 상호',   // [필수]
    invoiceeCEOName : '공급받는자 대표자 성명',   // [필수]
    invoiceeAddr : '공급받는자 주소',
    invoiceeBizClass : '공급받는자 업종',
    invoiceeBizType : '공급받는자 업태',
    invoiceeContactName1 : '공급받는자 담당자명',
    invoiceeTEL1 : '010-111-222',
    invoiceeHP1 : '070-111-222',
    invoiceeEmail1 : 'test2@test.com',
    invoiceeSMSSendYN : false,          // 역발행시 알림문자 전송여부

    taxTotal : '1000',                  // [필수] 세액합계
    supplyCostTotal : '10000',          // [필수] 공급가액 합계
    totalAmount : '11000',              // [필수] 합계금액(세액합계 + 공급가액 합계)

    //modifyCode : 1,                   // [수정세금계산서 발행시 필수] 수정사유코드, 수정세금계산서 작성방법에 대한 자세한 방법은 아래의 링크 참조
                                        // 수정세금계산서 작성방법 안내 : http://blog.linkhub.co.kr/650/

    //originalTaxinvoiceKey : '',       // [수정세금계산서 발행시 필수] 원본세금계산서의 ItemKey값 기재,

    serialNum : '123',                  // 기재 상 '일련번호'' 항목
    cash : '',                          // 기재 상 '현금'' 항목
    chkBill : '',                       // 기재 상 '수표' 항목
    note : '',                          // 기재 상 '어음' 항목
    credit : '',                        // 기재 상 '외상' 항목
    remark1 : '비고',
    remark2 : '비고2',
    remark3 : '비고3',
    kwon : '',                          // 기재 상 '권' 항목
    ho : '',                            // 기재 상 '호' 항목
    businessLicenseYN : false,          // 사업자등록증 첨부여부
    bankBookYN : false,                 // 통장사본 첨부여부

    // 상세항목(품목) 정보 배열, 99개까지 기재 가능
    detailList : [
      {
          serialNum : 1,                // 일련번호, 1부터 순차기재
          purchaseDT : '20150721',      // 거래일자, 형식 : yyyyMMdd
          itemName : '품명',
          spec : '규격',
          qty : '1',                    // 수량, 소수점 2자리까지 기재 가능
          unitCost : '10000',           // 단가, 소수점 2자리까지 기재 가능
          supplyCost : '10000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
          tax : '1000',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
          remark : '비고'
      },
      {
          serialNum : 2,
          itemName : '품명2'
      }
    ],

    // 추가담당자 정보 배열
    addContactList : [
      {
        serialNum : 1,                    // 일련번호, 1부터 순차기재
        contactName : '담당자 성명',         // 담당자 성명
        email : 'test2@test.com'          // 담당자 메일
      },
      {
        serialNum : 2,
        contactName : '담당자 성명 2',
        email : 'test3@test.com'
      }
    ]
  };

  taxinvoiceService.registIssue(testCorpNum, Taxinvoice,
    function(result){
      res.render('response', {path : req.path, code: result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 세금계산서 임시저장
router.get('/register', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';            // 팝빌회원 아이디
  var mgtKey = '20150813-01';              // 문서관리번호, 1~24자리 영문,숫자,'-','_' 조합으로 사업자별로 중복되지 않도록 구성
  var writeSpecification = false;          // 거래명세서 동시작성여부

  // 세금계산서 항목
  var Taxinvoice = {
    writeDate : '20150813',             // [필수] 작성일자, 형태 yyyyMMdd
    chargeDirection : '정과금',           // [필수] 과금방향, (정과금, 역과금) 중 기재, 역과금은 역발행의 경우만 가능
    issueType : '정발행',                 // [필수] 발행형태, (정발행, 역발행, 위수탁) 중 기재
    purposeType : '영수',                // [필수] (영수, 청구) 중 기재
    issueTiming : '직접발행',             // [필수] 발행시점, (직접발행, 승인시자동발행) 중 기재
    taxType : '과세',                    // [필수] 과세형태, (과세, 영세, 면세) 중 기재

    invoicerCorpNum : '1234567890',     // [필수] 공급자 사업자번호, '-' 제외 10자리
    invoicerMgtKey : mgtKey,            // [정발행시 필수] 문서관리번호, 1~24자리 숫자,영문,'-','_' 조합으로 사업자별로
    invoicerTaxRegID : '1234',          // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
    invoicerCorpName : '공급자 상호',      // [필수]
    invoicerCEOName : '대표자 성명',       // [필수]
    invoicerAddr : '공급자 주소',
    invoicerBizClass : '공급자 업종',
    invoicerBizType : '공급자 업태',
    invoicerContactName : '공급자 담당자명',
    invoicerTEL : '070-7510-3710',
    invoicerHP : '010-000-111',
    invoicerEmail : 'test@test.com',
    invoicerSMSSendYN : false,          // 정발행시 알림문자 전송여부

    invoiceeType : '사업자',              // [필수] 공급받는자 구분, (사업자, 개인, 외국인) 기재
    invoiceeCorpNum : '8888888888',     // [필수] 공급받는자 사업자번호, '-'제외 10자리
    invoiceeMgtKey : '',                // 공급받는자 문서관리번호
    invoiceeTaxRegID : '',              // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
    invoiceeCorpName : '공급받는자 상호',   // [필수]
    invoiceeCEOName : '공급받는자 대표자 성명',   // [필수]
    invoiceeAddr : '공급받는자 주소',
    invoiceeBizClass : '공급받는자 업종',
    invoiceeBizType : '공급받는자 업태',
    invoiceeContactName1 : '공급받는자 담당자명',
    invoiceeTEL1 : '010-111-222',
    invoiceeHP1 : '070-111-222',
    invoiceeEmail1 : 'test2@test.com',
    invoiceeSMSSendYN : false,          // 역발행시 알림문자 전송여부

    taxTotal : '1000',                  // [필수] 세액합계
    supplyCostTotal : '10000',          // [필수] 공급가액 합계
    totalAmount : '11000',              // [필수] 합계금액(세액합계 + 공급가액 합계)

    //modifyCode : 1,                   // [수정세금계산서 발행시 필수] 수정사유코드, 수정세금계산서 작성방법에 대한 자세한 방법은 아래의 링크 참조
                                        // 수정세금계산서 작성방법 안내 : http://blog.linkhub.co.kr/650/

    //originalTaxinvoiceKey : '',       // [수정세금계산서 발행시 필수] 원본세금계산서의 ItemKey값 기재,

    serialNum : '123',                  // 기재 상 '일련번호'' 항목
    cash : '',                          // 기재 상 '현금'' 항목
    chkBill : '',                       // 기재 상 '수표' 항목
    note : '',                          // 기재 상 '어음' 항목
    credit : '',                        // 기재 상 '외상' 항목
    remark1 : '비고',
    remark2 : '비고2',
    remark3 : '비고3',
    kwon : '',                          // 기재 상 '권' 항목
    ho : '',                            // 기재 상 '호' 항목
    businessLicenseYN : false,          // 사업자등록증 첨부여부
    bankBookYN : false,                 // 통장사본 첨부여부

    // 상세항목(품목) 정보 배열, 99개까지 기재 가능
    detailList : [
      {
          serialNum : 1,                // 일련번호, 1부터 순차기재
          purchaseDT : '20150721',      // 거래일자, 형식 : yyyyMMdd
          itemName : '품명',
          spec : '규격',
          qty : '1',                    // 수량, 소수점 2자리까지 기재 가능
          unitCost : '10000',           // 단가, 소수점 2자리까지 기재 가능
          supplyCost : '10000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
          tax : '1000',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
          remark : '비고'
      },
      {
          serialNum : 2,
          itemName : '품명2'
      }
    ],

    // 추가담당자 정보 배열
    addContactList : [
      {
        serialNum : 1,                    // 일련번호, 1부터 순차기재
        contactName : '담당자 성명',         // 담당자 성명
        email : 'test2@test.com'          // 담당자 메일
      },
      {
        serialNum : 2,
        contactName : '담당자 성명 2',
        email : 'test3@test.com'
      }
    ]
  };

  taxinvoiceService.register(testCorpNum, Taxinvoice, testUserID, writeSpecification,
    function(result){
      res.render('response', {path : req.path, code: result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 세금계산서 수정, 임시저장 상태에서만 가능
router.get('/update', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';            // 팝빌회원 아이디
  var mgtKey = '20150813-01';              // 수정하고자하는 원본 세금계산서 문서관리번호
  var keyType = popbill.MgtKeyType.SELL;   // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁

  // 세금계산서 항목
  var Taxinvoice = {
    writeDate : '20150813',             // [필수] 작성일자, 형태 yyyyMMdd
    chargeDirection : '정과금',           // [필수] 과금방향, (정과금, 역과금) 중 기재, 역과금은 역발행의 경우만 가능
    issueType : '정발행',                 // [필수] 발행형태, (정발행, 역발행, 위수탁) 중 기재
    purposeType : '영수',                // [필수] (영수, 청구) 중 기재
    issueTiming : '직접발행',             // [필수] 발행시점, (직접발행, 승인시자동발행) 중 기재
    taxType : '과세',                    // [필수] 과세형태, (과세, 영세, 면세) 중 기재

    invoicerCorpNum : '1234567890',     // [필수] 공급자 사업자번호, '-' 제외 10자리
    invoicerMgtKey : mgtKey,            // 문서관리번호, 1~24자리 숫자,영문,'-','_' 조합으로 사업자별로
    invoicerTaxRegID : '1234',          // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
    invoicerCorpName : '공급자 상호_수정',
    invoicerCEOName : '대표자 성명_수정',
    invoicerAddr : '공급자 주소',
    invoicerBizClass : '공급자 업종',
    invoicerBizType : '공급자 업태',
    invoicerContactName : '공급자 담당자명',
    invoicerTEL : '070-7510-3710',
    invoicerHP : '010-000-111',
    invoicerEmail : 'test@test.com',
    invoicerSMSSendYN : false,          // 정발행시 알림문자 전송여부

    invoiceeType : '사업자',              // [필수] 공급받는자 구분, (사업자, 개인, 외국인) 기재
    invoiceeCorpNum : '8888888888',     // 공급받는자 사업자번호, '-'제외 10자리
    invoiceeMgtKey : '',
    invoiceeTaxRegID : '',              // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
    invoiceeCorpName : '공급받는자 상호',
    invoiceeCEOName : '공급받는자 대표자 성명',
    invoiceeAddr : '공급받는자 주소',
    invoiceeBizClass : '공급받는자 업종',
    invoiceeBizType : '공급받는자 업태',
    invoiceeContactName1 : '공급받는자 담당자명',
    invoiceeTEL1 : '010-111-222',
    invoiceeHP1 : '070-111-222',
    invoiceeEmail1 : 'test2@test.com',
    invoiceeSMSSendYN : false,          // 역발행시 알림문자 전송여부

    taxTotal : '1000',                  // [필수] 세액합계
    supplyCostTotal : '10000',          // [필수] 공급가액 합계
    totalAmount : '11000',              // [필수] 합계금액(세액합계 + 공급가액 합계)

    //modifyCode : 1,                   // [수정세금계산서 발행시 필수] 수정사유코드, 수정세금계산서 작성방법에 대한 자세한 방법은 아래의 링크 참조
                                        // 수정세금계산서 작성방법 안내 : http://blog.linkhub.co.kr/650/

    //originalTaxinvoiceKey : '',       // [수정세금계산서 발행시 필수] 원본세금계산서의 ItemKey값 기재,

    serialNum : '123',                  // 기재 상 '일련번호'' 항목
    cash : '',                          // 기재 상 '현금'' 항목
    chkBill : '',                       // 기재 상 '수표' 항목
    note : '',                          // 기재 상 '어음' 항목
    credit : '',                        // 기재 상 '외상' 항목
    remark1 : '비고',
    remark2 : '비고2',
    remark3 : '비고3',
    kwon : '',                          // 기재 상 '권' 항목
    ho : '',                            // 기재 상 '호' 항목
    businessLicenseYN : false,          // 사업자등록증 첨부여부
    bankBookYN : false,                 // 통장사본 첨부여부

    // 상세항목(품목) 정보 배열, 99개까지 기재 가능
    detailList : [
      {
          serialNum : 1,                // 일련번호, 1부터 순차기재
          purchaseDT : '20150721',      // 거래일자, 형식 : yyyyMMdd
          itemName : '품명',
          spec : '규격',
          qty : '1',                    // 수량, 소수점 2자리까지 기재 가능
          unitCost : '10000',           // 단가, 소수점 2자리까지 기재 가능
          supplyCost : '10000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
          tax : '1000',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
          remark : '비고'
      },
      {
          serialNum : 2,
          itemName : '품명2'
      }
    ],

    // 추가담당자 정보 배열
    addContactList : [
      {
        serialNum : 1,                    // 일련번호, 1부터 순차기재
        contactName : '담당자 성명',         // 담당자 성명
        email : 'test2@test.com'          // 담당자 메일
      },
      {
        serialNum : 2,
        contactName : '담당자 성명 2',
        email : 'test3@test.com'
      }
    ]
  };

  taxinvoiceService.update(testCorpNum, keyType, mgtKey, Taxinvoice, testUserID,
    function(result){
      res.render('response', {path : req.path, code: result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 세금계산서 요약/상태정보 단건조회
router.get('/getInfo', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;   // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';              // 문서관리번호
  var testUserID = 'testkorea';            // 팝빌회원 아이디

  taxinvoiceService.getInfo(testCorpNum, keyType, mgtKey, testUserID,
    function(result){
      res.render('Taxinvoice/TaxinvoiceInfo',{path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 세금계산서 요약/상태정보 다량조회
router.get('/getInfos', function(req,res,next){

  var testCorpNum = '1234567890';                   // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;            // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKeyList = ['20150813-01', '20150813-02'];  // 문서관리번호 배열
  var testUserID = 'testkorea';                     // 팝빌회원 아이디

  taxinvoiceService.getInfos(testCorpNum, keyType, mgtKeyList, testUserID,
    function(result){
      res.render('Taxinvoice/TaxinvoiceInfos',{path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 세금계산서 상세정보 조회
router.get('/getDetailInfo',function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;   // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';              // 문서관리번호
  var testUserID = 'testkorea';            // 팝빌회원 아이디

  taxinvoiceService.getDetailInfo(testCorpNum, keyType, mgtKey, testUserID,
    function(result){
      res.render('Taxinvoice/TaxinvoiceDetail', {path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 세금계산서 목록 조회
router.get('/search', function(req,res,next){

  var testCorpNum = '1234567890';         // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;  // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var DType = 'R';                        // 검색일자유형, R-등록일시, W-작성일시, I-발행일시
  var SDate = '20160101';                 // 시작일자, 형태(yyyyMMdd)
  var EDate = '20160315';                 // 종료일자, 형태(yyyyMMdd)

  var State = ['100','200','3**'];        // 전송상태값 배열, 문서상태 값 3자리 배열
  var Type = ['N', 'M'];                  // 문서유형, N-일반세금계산서, M-수정세금계산서
  var TaxType = ['T','N','Z'];            // 과세유형, T-과세, N-면세, Z-영세
  var LateOnly = null;                    // 지연발행 여부, null-전체조회, true-지연발행분, false-정상발행분

  var Order = 'A';                        // 정렬방향, D-내림차순, A-오름차순
  var Page = 17;                           // 페이지 번호
  var PerPage = 15;                       // 페이지당 검색개수, 최대 1000건

  taxinvoiceService.search(testCorpNum, keyType, DType, SDate, EDate, State, Type, TaxType, LateOnly, Order, Page, PerPage,
    function(result){
      res.render('Taxinvoice/Search', {path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 삭제
router.get('/delete', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL; // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01'; // 문서관리번호
  var testUserID = 'testkorea';            // 팝빌회원 아이디

  taxinvoiceService.delete(testCorpNum, keyType, mgtKey, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 이력조회
router.get('/getLogs', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL; // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-02'; // 문서관리번호
  var testUserID = 'testkorea';            // 팝빌회원 아이디

  taxinvoiceService.getLogs(testCorpNum, keyType, mgtKey, testUserID,
    function(result){
      res.render('Taxinvoice/TaxinvoiceLogs', {path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 파일첨부
router.get('/attachFile', function(req,res,next){

  var testCorpNum = '1234567890';              // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;       // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';                  // 문서관리번호
  var testUserID = 'testkorea';                // 팝빌회원 아이디
  var FilePaths = ['../테스트.jpg'];             // 파일경로
  var fileName = FilePaths[0].replace(/^.*[\\\/]/, '');     // 파일명

  taxinvoiceService.attachFile(testCorpNum, keyType, mgtKey, fileName, FilePaths, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 첨부파일 목록 확인
router.get('/getFiles', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;   // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';              // 문서관리번호

  taxinvoiceService.getFiles(testCorpNum, keyType, mgtKey,
    function(result){
      res.render('Taxinvoice/AttachedFile', {path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 첨부파일 삭제
router.get('/deleteFile', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;   // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';              // 문서관리번호
  var testUserID = 'testkorea';            // 팝빌회원 아이디
  var fileID = 'CC36D088-5CF5-421D-82EC-8F166E5709DE.PBF';    // 파일아이디, getFiles API의 attachedFile 변수값으로 확인

  taxinvoiceService.deleteFile(testCorpNum, keyType, mgtKey, fileID, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 발행예정
router.get('/send', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;   // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';              // 문서관리번호
  var testUserID = 'testkorea';            // 팝빌회원 아이디
  var memo = '발행예정 메모';                 // 메모
  var emailSubject = '';                   // 안내메일 제목, 미기재시 기본양식으로 전송

  taxinvoiceService.send(testCorpNum, keyType, mgtKey, memo, emailSubject, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 발행예정 취소
router.get('/cancelSend', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;   // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';              // 문서관리번호
  var testUserID = 'testkorea';            // 팝빌회원 아이디
  var memo = '발행예정 취소 메모';              // 메모

  taxinvoiceService.cancelSend(testCorpNum, keyType, mgtKey, memo, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 승인
router.get('/accept', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.BUY;    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';              // 문서관리번호
  var testUserID = 'testkorea';            // 팝빌회원 아이디
  var memo = '발행예정 승인 메모';

  taxinvoiceService.accept(testCorpNum, keyType, mgtKey, memo, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 거부
router.get('/deny', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.BUY;    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';              // 문서관리번호
  var testUserID = 'testkorea';            // 팝빌회원 아이디
  var memo = '발행예정 거부 메모';

  taxinvoiceService.deny(testCorpNum, keyType, mgtKey, memo, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 발행
router.get('/issue', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;   // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';              // 문서관리번호
  var memo = '발행 메모';                    // 메모
  var emailSubject = '';                   // 발행 안내메일 제목, 미기재시 기본제목으로 전송
  var forceIssue = true;                   // 지연발행 강제여부
  var testUserID = 'testkorea';            // 팝빌회원 아이디

  taxinvoiceService.issue(testCorpNum, keyType, mgtKey, memo, emailSubject, forceIssue, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 발행취소
router.get('/cancelIssue', function(req,res,next){

  var testCorpNum = '1234567890';           // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';               // 문서관리번호
  var testUserID = 'testkorea';             // 팝빌회원 아이디
  var memo = '발행취소 메모';                   // 메모

  taxinvoiceService.cancelIssue(testCorpNum, keyType, mgtKey, memo, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 역발행요청
router.get('/request', function(req,res,next){

  var testCorpNum = '1234567890';           // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.BUY;     // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150722-04';               // 문서관리번호
  var testUserID = 'testkorea';             // 팝빌회원 아이디
  var memo = '역발행요청 메모';                 // 메모

  taxinvoiceService.request(testCorpNum, keyType, mgtKey, memo, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 역발행요청 취소
router.get('/cancelRequest', function(req,res,next){

  var testCorpNum = '1234567890';            // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.BUY;      // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150722-03';                // 문서관리번호
  var testUserID = 'testkorea';              // 팝빌회원 아이디
  var memo = '역발행요청 취소 메모';              // 메모

  taxinvoiceService.cancelRequest(testCorpNum, keyType, mgtKey, memo, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 역발행요청 거부
router.get('/refuse', function(req,res,next){

  var testCorpNum = '1234567890';           // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150722-04';               // 문서관리번호
  var testUserID = 'testkorea';             // 팝빌회원 아이디
  var memo = '역발행요청 거부 메모';             // 메모

  taxinvoiceService.refuse(testCorpNum, keyType, mgtKey, memo, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 국세청 즉시전송
router.get('/sendToNTS', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;   // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';              // 문서관리번호
  var testUserID = 'testkorea';            // 팝빌회원 아이디

  taxinvoiceService.sendToNTS(testCorpNum, keyType, mgtKey, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});


// 이메일 전송
router.get('/sendEmail', function(req,res,next){

  var testCorpNum = '1234567890';             // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;      // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';                 // 문서관리번호
  var receiver = 'test@test.com';    // 수신 메일주소
  var testUserID = 'testkorea';               // 팝빌회원 아이디

  taxinvoiceService.sendEmail(testCorpNum, keyType, mgtKey, receiver, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 알림문자 전송
router.get('/sendSMS', function(req,res,next){

  var testCorpNum = '1234567890';               // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;        // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';                   // 문서관리번호
  var senderNum = '07075103710';                // 발신번호
  var receiverNum = '000111222';              // 수신번호
  var contents = '팝빌 전자세금계산서 문자전송';        // 메세지 내용, 90byte 초과시 길이가 조정됨.
  var testUserID = 'testkorea';                  // 팝빌회원 아이디

  taxinvoiceService.sendSMS(testCorpNum, keyType, mgtKey, senderNum, receiverNum, contents, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 전자세금계산서 팩스 전송
router.get('/sendFAX', function(req,res,next){

  var testCorpNum = '1234567890';           // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';               // 문서관리번호
  var senderNum = '07075103710';            // 발신번호
  var receiverNum = '000111222';            // 수신팩스번호
  var testUserID = 'testkorea';             // 팝빌회원 아이디

  taxinvoiceService.sendFAX(testCorpNum, keyType, mgtKey, senderNum, receiverNum, testUserID,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 팝빌 세금계산서 관련 URL 요청
router.get('/getURL', function(req,res,next){

  var testCorpNum = '1234567890';     // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';       // 팝빌회원 아이디
  var TOGO = 'PBOX';                  // TBOX : 임시문서함 , SBOX : 매출문서함 , PBOX : 매입문서함 , WRITE : 매출작성

  taxinvoiceService.getURL(testCorpNum, TOGO, testUserID,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});

// 세금계산서 팝업 URL
router.get('/getPopUpURL', function(req,res,next){

  var testCorpNum = '1234567890';             // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';               // 팝빌회원 아이디
  var keyType = popbill.MgtKeyType.SELL;      // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';                 // 문서관리번호

  taxinvoiceService.getPopUpURL(testCorpNum, keyType, mgtKey, testUserID,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});

// 세금계산서 단건 인쇄 URL
router.get('/getPrintURL', function(req,res,next){

  var testCorpNum = '1234567890';               // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';                 // 팝빌회원 아이디
  var keyType = popbill.MgtKeyType.SELL;        // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';                   // 문서관리번호

  taxinvoiceService.getPrintURL(testCorpNum, keyType, mgtKey, testUserID,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});

// 세금계산서 대량 인쇄 URL
router.get('/getMassPrintURL', function(req,res,next){

  var testCorpNum = '1234567890';                 // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';                   // 팝빌회원 아이디
  var keyType = popbill.MgtKeyType.SELL;          // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKeyList = ['20150813-01', '20150813-02']; // 문서관리번호열 배열, 최대 100건

  taxinvoiceService.getMassPrintURL(testCorpNum, keyType, mgtKeyList, testUserID,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});

// 세금계산서 인쇄 URL (공급받는자)
router.get('/getEPrintURL', function(req,res,next){

  var testCorpNum = '1234567890';           // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';             // 팝빌회원 아이디
  var keyType = popbill.MgtKeyType.SELL;    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';               // 문서관리번호

  taxinvoiceService.getEPrintURL(testCorpNum, keyType, mgtKey, testUserID,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});

// 공급받는자(메일링크) URL
router.get('/getMailURL', function(req,res,next){

  var testCorpNum = '1234567890';           // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';             // 팝빌회원 아이디
  var keyType = popbill.MgtKeyType.SELL;    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20150813-01';               // 문서관리번호

  taxinvoiceService.getMailURL(testCorpNum, keyType, mgtKey, testUserID,
    function(url){
      res.render('result', {path : req.path, result : url});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});

// 세금계산서 발행단가 확인
router.get('/getUnitCost', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리

  taxinvoiceService.getUnitCost(testCorpNum,
    function(unitCost){
    res.render('result', {path : req.path, result : unitCost});
  }, function(Error){
    res.render('response', {path : req.path, code : Error.code, message : Error.message});
  });
});

// 등록된 공인인증서 만료일자 확인
router.get('/getCertificateExpireDate', function(req,res,next){

  var testCorpNum = '1234567890';          // 팝빌회원 사업자번호, '-' 제외 10자리

  taxinvoiceService.getCertificateExpireDate(testCorpNum,
    function(expireDate){
      res.render('result', {path : req.path, result : expireDate});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 대용량 연계사업자 이메일 목록 확인
router.get('/getEmailPublicKeys', function(req,res,next){

  var testCorpNum = '1234567890';       // 팝빌회원 사업자번호, '-' 제외 10자리
  var testUserID = 'testkorea';         // 팝빌회원 아이디

  taxinvoiceService.getEmailPublicKeys(testCorpNum, testUserID,
    function(result){
      res.render('Taxinvoice/EmailPublicKeys', {path : req.path, result : result});
    }, function(Error){
      res.render('response', {path : req.path, code :Error.code, message :Error.message});
    });
});

// 전자명세서 첨부
router.get('/attachStatement', function(req,res,next){

  var testCorpNum = '1234567890';           // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20160317-01';               // 문서관리번호
  var subItemCode = 121;                    // 첨부할 전자명세서 종류코드, 121-거래명세서, 122-청구서, 123-발주서, 124-견적서, 125-입금표, 126-영수증
  var subMgtKey = '20160317-01'             // 첨부할 전자명세서 관리번호

  taxinvoiceService.attachStatement(testCorpNum, keyType, mgtKey, subItemCode, subMgtKey,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

// 전자명세서 첨부해제
router.get('/detachStatement', function(req,res,next){

  var testCorpNum = '1234567890';           // 팝빌회원 사업자번호, '-' 제외 10자리
  var keyType = popbill.MgtKeyType.SELL;    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
  var mgtKey = '20160317-01';               // 문서관리번호
  var subItemCode = 121;                    // 첨부해제할 전자명세서 종류코드, 121-거래명세서, 122-청구서, 123-발주서, 124-견적서, 125-입금표, 126-영수증
  var subMgtKey = '20160317-01'             // 첨부해제할 전자명세서 관리번호

  taxinvoiceService.detachStatement(testCorpNum, keyType, mgtKey, subItemCode, subMgtKey,
    function(result){
      res.render('response', {path : req.path, code : result.code, message : result.message});
    }, function(Error){
      res.render('response', {path : req.path, code : Error.code, message : Error.message});
    });
});

module.exports = router;







