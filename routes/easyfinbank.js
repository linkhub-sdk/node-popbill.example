var express = require('express');
var router = express.Router();
var popbill = require('popbill');

/*
 * 팝빌 서비스 연동환경 초기화
 */
popbill.config({

    // 링크아이디
    LinkID: 'TESTER',

    // 비밀키
    SecretKey: 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',

    // 연동환경 설정값, 개발용(true), 상업용(false)
    IsTest: true,

    // 인증토큰 IP제한기능 사용여부, 권장(true)
    IPRestrictOnOff: true,

    // 인증토큰정보 로컬서버 시간 사용여부
    UseLocalTimeYN: true,

    // 팝빌 API 서비스 고정 IP 사용여부
    UseStaticIP: false,

    // 로컬서버 시간 사용여부 true-사용(기본값-권장), false-미사용
    UseLocalTimeYN: true,

    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

/*
 * 계좌조회 API 연계 모듈 초기화
 */
var easyFinBankService = popbill.EasyFinBankService();

// API List Index
router.get('/', function (req, res, next) {
    res.render('EasyFinBank/index', {});
});

/*
 * 계좌 등록, 수정 및 삭제할 수 있는 계좌 관리 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetBankAccountMgtURL
 */
router.get('/getBankAccountMgtURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    easyFinBankService.getBankAccountMgtURL(testCorpNum,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/*
 * 계좌조회 서비스를 이용할 계좌를 팝빌에 등록합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#RegistBankAccount
 */
router.get('/registBankAccount', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 계좌정보
    var bankAccountInfo =  {

      // [필수] 은행코드
      // 산업은행-0002 / 기업은행-0003 / 국민은행-0004 /수협은행-0007 / 농협은행-0011 / 우리은행-0020
      // SC은행-0023 / 대구은행-0031 / 부산은행-0032 / 광주은행-0034 / 제주은행-0035 / 전북은행-0037
      // 경남은행-0039 / 새마을금고-0045 / 신협은행-0048 / 우체국-0071 / KEB하나은행-0081 / 신한은행-0088 /씨티은행-0027
      BankCode : '',

      // [필수] 계좌번호, 하이픈('-') 제외
      AccountNumber : '',

      // [필수] 계좌비밀번호
      AccountPWD : '',

      // [필수] 계좌유형, "법인" 또는 "개인" 입력
      AccountType : '',

      // [필수] 예금주 식별정보 (‘-‘ 제외)
      // 계좌유형이 “법인”인 경우 : 사업자번호(10자리)
      // 계좌유형이 “개인”인 경우 : 예금주 생년월일 (6자리-YYMMDD)
      IdentityNumber : '',

      // 계좌 별칭
      AccountName : '',

      // 인터넷뱅킹 아이디 (국민은행 필수)
      BankID : '',

      // 조회전용 계정 아이디 (대구은행, 신협, 신한은행 필수)
      FastID : '',

      // 조회전용 계정 비밀번호 (대구은행, 신협, 신한은행 필수
      FastPWD : '',

      // 결제기간(개월), 1~12 입력가능, 미기재시 기본값(1) 처리
      // - 파트너 과금방식의 경우 입력값에 관계없이 1개월 처리
      UsePeriod : '1',

      // 메모
      Memo : ''
    };

    easyFinBankService.registBankAccount(testCorpNum, bankAccountInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에 등록된 계좌정보를 수정합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#UpdateBankAccount
 */
router.get('/updateBankAccount', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 계좌정보
    var bankAccountInfo =  {

      // [필수] 은행코드
      // 산업은행-0002 / 기업은행-0003 / 국민은행-0004 /수협은행-0007 / 농협은행-0011 / 우리은행-0020
      // SC은행-0023 / 대구은행-0031 / 부산은행-0032 / 광주은행-0034 / 제주은행-0035 / 전북은행-0037
      // 경남은행-0039 / 새마을금고-0045 / 신협은행-0048 / 우체국-0071 / KEB하나은행-0081 / 신한은행-0088 /씨티은행-0027
      BankCode : '',

      // [필수] 계좌번호, 하이픈('-') 제외
      AccountNumber : '',

      // [필수] 계좌비밀번호
      AccountPWD : '',

      // 계좌 별칭
      AccountName : '',

      // 인터넷뱅킹 아이디 (국민은행 필수)
      BankID : '',

      // 조회전용 계정 아이디 (대구은행, 신협, 신한은행 필수)
      FastID : '',

      // 조회전용 계정 비밀번호 (대구은행, 신협, 신한은행 필수
      FastPWD : '',

      // 메모
      Memo : ''
    };

    easyFinBankService.updateBankAccount(testCorpNum, bankAccountInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 계좌의 정액제 해지를 요청합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#CloseBankAccount
 */
router.get('/closeBankAccount', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 은행코드
    // 산업은행-0002 / 기업은행-0003 / 국민은행-0004 /수협은행-0007 / 농협은행-0011 / 우리은행-0020
    // SC은행-0023 / 대구은행-0031 / 부산은행-0032 / 광주은행-0034 / 제주은행-0035 / 전북은행-0037
    // 경남은행-0039 / 새마을금고-0045 / 신협은행-0048 / 우체국-0071 / KEB하나은행-0081 / 신한은행-0088 /씨티은행-0027
    var bankCode = "";

    // 계좌번호, 하이픈('-') 제외
    var accountNumber = "";

    // 해지유형, "일반", "중도" 중 선택기재
    // 일반해지 - 이용중인 정액제 사용기간까지 이용후 정지
    // 중도해지 - 요청일 기준으로 정지, 정액제 잔여기간은 일할로 계산되어 포인트 환불
    var closeType = "중도"

    easyFinBankService.closeBankAccount(testCorpNum, bankCode, accountNumber, closeType,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 신청한 정액제 해지요청을 취소합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#RevokeCloseBankAccount
 */
router.get('/revokeCloseBankAccount', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 은행코드
    // 산업은행-0002 / 기업은행-0003 / 국민은행-0004 /수협은행-0007 / 농협은행-0011 / 우리은행-0020
    // SC은행-0023 / 대구은행-0031 / 부산은행-0032 / 광주은행-0034 / 제주은행-0035 / 전북은행-0037
    // 경남은행-0039 / 새마을금고-0045 / 신협은행-0048 / 우체국-0071 / KEB하나은행-0081 / 신한은행-0088 /씨티은행-0027
    var bankCode = "";

    // 계좌번호, 하이픈('-') 제외
    var accountNumber = "";

    easyFinBankService.revokeCloseBankAccount(testCorpNum, bankCode, accountNumber,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 등록된 계좌를 삭제합니다.
 * - 정액제가 아닌 종량제 이용 시에만 등록된 계좌를 삭제할 수 있습니다.
 * - https://docs.popbill.com/easyfinbank/node/api#DeleteBankAccount
 */
router.get('/deleteBankAccount', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 은행코드
    // 산업은행-0002 / 기업은행-0003 / 국민은행-0004 /수협은행-0007 / 농협은행-0011 / 우리은행-0020
    // SC은행-0023 / 대구은행-0031 / 부산은행-0032 / 광주은행-0034 / 제주은행-0035 / 전북은행-0037
    // 경남은행-0039 / 새마을금고-0045 / 신협은행-0048 / 우체국-0071 / KEB하나은행-0081 / 신한은행-0088 /씨티은행-0027
    var bankCode = "";

    // 계좌번호, 하이픈('-') 제외
    var accountNumber = "";

    easyFinBankService.deleteBankAccount(testCorpNum, bankCode, accountNumber,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에 등록된 계좌 정보를 확인합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetBankAccountInfo
 */
router.get('/getBankAccountInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 은행코드
    // 산업은행-0002 / 기업은행-0003 / 국민은행-0004 /수협은행-0007 / 농협은행-0011 / 우리은행-0020
    // SC은행-0023 / 대구은행-0031 / 부산은행-0032 / 광주은행-0034 / 제주은행-0035 / 전북은행-0037
    // 경남은행-0039 / 새마을금고-0045 / 신협은행-0048 / 우체국-0071 / KEB하나은행-0081 / 신한은행-0088 /씨티은행-0027
    var bankCode = "";

    // 계좌번호, 하이픈('-') 제외
    var accountNumber = "";

    easyFinBankService.getBankAccountInfo(testCorpNum, bankCode, accountNumber,
        function (result) {
            res.render('EasyFinBank/getBankAccountInfo', {path: req.path, info: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/*
 * 팝빌에 등록된 은행계좌 목록을 반환한다.
 * - https://docs.popbill.com/easyfinbank/node/api#ListBankAccount
 */
router.get('/listBankAccount', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    easyFinBankService.listBankAccount(testCorpNum,
        function (response) {
            res.render('EasyFinBank/listBankAccount', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 계좌 거래내역을 확인하기 위해 팝빌에 수집요청을 합니다. (조회기간 단위 : 최대 1개월)
 * - 조회일로부터 최대 3개월 이전 내역까지 조회할 수 있습니다.
 * - https://docs.popbill.com/easyfinbank/node/api#RequestJob
 */
router.get('/requestJob', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 은행코드
    var bankCode = '0039';

    // 계좌번호,  하이픈('-') 제외
    var accountNumber = '2070064402404';

    // 시작일자, 날짜형식(yyyyMMdd)
    var SDate = '20210801';

    // 종료일자, 날짜형식(yyyyMMdd)
    var EDate = '20210810';

    easyFinBankService.requestJob(testCorpNum, bankCode, accountNumber, SDate, EDate,
        function (jobID) {
            res.render('result', {path: req.path, result: jobID})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * RequestJob(수집 요청)를 통해 반환 받은 작업아이디의 상태를 확인합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetJobState
 */
router.get('/getJobState', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 작업아이디
    var jobID = '021123110000000001';

    easyFinBankService.getJobState(testCorpNum, jobID,
        function (response) {
            res.render('EasyFinBank/jobState', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/*
 * 계좌조회 정액제 서비스 신청 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetFlatRatePopUpURL
 */
router.get('/getFlatRatePopUpURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    easyFinBankService.getFlatRatePopUpURL(testCorpNum,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * RequestJob(수집 요청)를 통해 반환 받은 작업아이디의 목록을 확인합니다.
 * - 수집 요청 후 1시간이 경과한 수집 요청건은 상태정보가 반환되지 않습니다.
 * - https://docs.popbill.com/easyfinbank/node/api#ListActiveJob
 */
router.get('/listActiveJob', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    easyFinBankService.listActiveJob(testCorpNum,
        function (response) {
            res.render('EasyFinBank/listActiveJob', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * GetJobState(수집 상태 확인)를 통해 상태 정보가 확인된 작업아이디를 활용하여 계좌 거래 내역을 조회합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#Search
 */
router.get('/search', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = '';

    // 작업아이디
    var jobID = '021072414000000001';

    // 거래유형 배열, I-입금 / O-출금
    var tradeType = ['I', 'O'];

    // 조회 검색어, 입금/출금액, 메모, 적요 like 검색
    var searchString = '';

    // 페이지번호
    var page = 1;

    // 페이지당 검색개수
    var perPage = 10;

    // 정렬방향, D-내림차순, A-오름차순
    var order = 'D';

    easyFinBankService.search(testCorpNum, jobID, tradeType, searchString, page, perPage, order, testUserID,
        function (response) {
            res.render('EasyFinBank/search', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * GetJobState(수집 상태 확인)를 통해 상태 정보가 확인된 작업아이디를 활용하여 계좌 거래내역의 요약 정보를 조회합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#Summary
 */
router.get('/summary', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = '';

    // 작업아이디
    var jobID = '021123110000000004';

    // 거래유형 배열, I-입금 / O-출금
    var tradeType = ['I', 'O'];

    // 조회 검색어, 입금/출금액, 메모, 적요 like 검색
    var searchString = '';

    easyFinBankService.summary(testCorpNum, jobID, tradeType, searchString, testUserID,
        function (response) {
            res.render('EasyFinBank/summary', {path: req.path, result: response})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 한 건의 거래 내역에 메모를 저장합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#SaveMemo
 */
router.get('/saveMemo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 거래내역 아이디, Search API 응답 list tid 항목 확인.
    var tid = '02112181100000000120211231000001';

    // 메모
    var memo = 'memo-nodejs';

    easyFinBankService.saveMemo(testCorpNum, tid, memo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 계좌조회 정액제 서비스 상태를 확인합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetFlatRateState
 */
router.get('/getFlatRateState', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 은행코드
    var bankCode = '0048';

    // 계좌번호, 하이픈('-') 제외
    var accountNumber = '131020538645';

    easyFinBankService.getFlatRateState(testCorpNum, bankCode, accountNumber,
        function (response) {
            res.render('EasyFinBank/flatRateState', {path: req.path, result: response});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 잔여포인트를 확인합니다.
 * - 과금방식이 파트너과금인 경우 파트너 잔여포인트(GetPartnerBalance API) 를 통해 확인하시기 바랍니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetBalance
 */
router.get('/getBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    easyFinBankService.getBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetChargeURL
 */
router.get('/getChargeURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    easyFinBankService.getChargeURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 결제내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetPaymentURL
 */
router.get('/getPaymentURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    easyFinBankService.getPaymentURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 사용내역 확인을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetUseHistoryURL
 */
router.get('/getUseHistoryURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    easyFinBankService.getUseHistoryURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너의 잔여포인트를 확인합니다.
 * - 과금방식이 연동과금인 경우 연동회원 잔여포인트(GetBalance API)를 이용하시기 바랍니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetPartnerBalance
 */
router.get('/getPartnerBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    easyFinBankService.getPartnerBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/*
 * 파트너 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetPartnerURL
 */
router.get('/getPartnerURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // CHRG(포인트충전)
    var TOGO = 'CHRG';

    easyFinBankService.getPartnerURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 계좌조회 API 서비스 과금정보를 확인합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetChargeInfo
 */
router.get('/getChargeInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    easyFinBankService.getChargeInfo(testCorpNum,
        function (result) {
            res.render('Base/getChargeInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/*
 * 사업자번호를 조회하여 연동회원 가입여부를 확인합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#CheckIsMember
 */
router.get('/checkIsMember', function (req, res, next) {

    // 조회할 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    easyFinBankService.checkIsMember(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사용하고자 하는 아이디의 중복여부를 확인합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#CheckID
 */
router.get('/checkID', function (req, res, next) {

    // 조회할 아이디
    var testID = 'testkorea';

    easyFinBankService.checkID(testID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사용자를 연동회원으로 가입처리합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#JoinMember
 */
router.get('/joinMember', function (req, res, next) {

    // 회원정보
    var joinInfo = {

        // 회원 아이디 (6자 이상 50자 미만)
        ID: 'userid',

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: 'asdf8536!@#',

        // 링크아이디
        LinkID: easyFinBankService._config.LinkID,

        // 사업자번호, '-' 제외 10자리
        CorpNum: '1234567890',

        // 대표자명 (최대 100자)
        CEOName: '대표자성명',

        // 상호 (최대 200자)
        CorpName: '테스트상호',

        // 주소 (최대 300자)
        Addr: '주소',

        // 업태 (최대 100자)
        BizType: '업태',

        // 종목 (최대 100자)
        BizClass: '업종',

        // 담당자 성명 (최대 100자)
        ContactName: '담당자 성명',

        // 담당자 이메일 (최대 20자)
        ContactEmail: 'test@test.com',

        // 담당자 연락처 (최대 20자)
        ContactTEL: '070-4304-2991',

        // 담당자 휴대폰번호 (최대 20자)
        ContactHP: '010-1234-1234'

    };

    easyFinBankService.joinMember(joinInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 사이트에 로그인 상태로 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetAccessURL
 */
router.get('/getAccessURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    easyFinBankService.getAccessURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 담당자(팝빌 로그인 계정)를 추가합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#RegistContact
 */
router.get('/registContact', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 담당자 정보
    var contactInfo = {

        // 아이디 (6자 이상 50자 미만)
        id: 'testkorea03033',

        // 비밀번호, 8자 이상 20자 이하(영문, 숫자, 특수문자 조합)
        Password: 'asdf8536!@#',

        // 담당자명 (최대 100자)
        personName: '담당자명0309',

        // 연락처 (최대 20자)
        tel: '070-4304-2991',

        // 휴대폰번호 (최대 20자)
        hp: '010-1234-1234',

        // 팩스번호 (최대 20자)
        fax: '070-4304-2991',

        // 이메일 (최대 100자)
        email: 'test@test.co.kr',

        // 담당자 권한, 1 : 개인권한, 2 : 읽기권한, 3 : 회사권한
        searchRole: 3

    };

    easyFinBankService.registContact(testCorpNum, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보을 확인합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetContactInfo
 */
router.get('/getContactInfo', function (req, res, next) {

    // 팝빌회원 사업자번호
    var testCorpNum = '1234567890';

    // 확인할 담당자 아이디
    var contactID = 'checkContactID';

    easyFinBankService.getContactInfo(testCorpNum, contactID,
        function (result) {
            res.render('Base/getContactInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 목록을 확인합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#ListContact
 */
router.get('/listContact', function (req, res, next) {

    // 조회할 아이디
    var testCorpNum = '1234567890';

    easyFinBankService.listContact(testCorpNum,
        function (result) {
            res.render('Base/listContact', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보를 수정합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#UpdateContact
 */
router.get('/updateContact', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    // 담당자 정보 항목
    var contactInfo = {

        // 담당자 아이디
        id: testUserID,

        // 담당자명 (최대 100자)
        personName: '담당자명0309',

        // 연락처 (최대 20자)
        tel: '070-4304-2991',

        // 휴대폰번호 (최대 20자)
        hp: '010-1234-1234',

        // 팩스번호 (최대 20자)
        fax: '070-4304-2991',

        // 이메일 (최대 100자)
        email: 'test@test.co.kr',

        // 담당자 권한, 1 : 개인권한, 2 : 읽기권한, 3 : 회사권한
        searchRole: 3

    };

    easyFinBankService.updateContact(testCorpNum, testUserID, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 확인합니다.
 * - https://docs.popbill.com/easyfinbank/node/api#GetCorpInfo
 */
router.get('/getCorpInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    easyFinBankService.getCorpInfo(testCorpNum,
        function (result) {
            res.render('Base/getCorpInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 수정합니다
 * - https://docs.popbill.com/easyfinbank/node/api#UpdateCorpInfo
 */
router.get('/updateCorpInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 회사정보
    var corpInfo = {

        // 대표자명 (최대 100자)
        ceoname: "대표자성명_nodejs",

        // 상호 (최대 200자)
        corpName: "업체명_nodejs",

        // 주소 (최대 300자)
        addr: "서구 천변좌로_nodejs",

        // 업태 (최대 100자)
        bizType: "업태_nodejs",

        // 종목 (최대 100자)
        bizClass: "종목_nodejs"

    };

    easyFinBankService.updateCorpInfo(testCorpNum, corpInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});



module.exports = router;
