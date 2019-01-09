var express = require('express');
var router = express.Router();
var popbill = require('popbill');

/*
 * 팝빌 서비스 연동환경 초기화
 */
popbill.config({

    //링크아이디
    LinkID: 'TESTER',

    //비밀키
    SecretKey: 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',

    //연동환경 설정값, 개발용(true), 상업용(false)
    IsTest: true,

    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

/*
 * 현금영수증 API 서비스 클래스 생성
 */
var cashbillService = popbill.CashbillService();

/*
 * Cashbill API Index 목록
 */
router.get('/', function (req, res, next) {
    res.render('Cashbill/index', {});
});

/*
 * 현금영수증 관리번호 중복여부를 확인합니다.
 * - 관리번호는 1~24자리로 숫자, 영문 '-', '_' 조합으로 구성할 수 있습니다.
 */
router.get('/checkMgtKeyInUse', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20190109-001';

    cashbillService.checkMgtKeyInUse(testCorpNum, mgtKey,
        function (result) {
            if (result) {
                res.render('result', {path: req.path, result: '사용중'});
            } else {
                res.render('result', {path: req.path, result: '미사용중'});
            }
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 현금영수증을 [즉시발행]합니다.
 * - 발행일 기준 오후 5시 이전에 발행된 현금영수증은 다음날 오후 2시에 국세청 전송결과를 확인할 수 있습니다.
 * - 현금영수증 국세청 전송 정책에 대한 정보는 "[현금영수증 API 연동매뉴얼] > 1.3. 국세청 전송정책"을 참조하시기 바랍니다.
 */
router.get('/registIssue', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호, 1~24자리 숫자, 영문, '-', '_'를 조합하여 사업자별로 중복되지 않도록 작성
    var MgtKey = '20190109-001';

    //현금영수증 상태메모
    var stateMemo = "발행메모";

    // 현금영수증 항목
    var cashbill = {

        // [필수] 문서관리번호
        mgtKey: MgtKey,

        // [필수] 문서형태, (승인거래, 취소거래) 중 기재
        tradeType: '승인거래',

        // [취소 현금영수증 발행시 필수] 원본 현금영수증 국세청 승인번호
        // 국세청 승인번호는 GetInfo API의 ConfirmNum 항목으로 확인할 수 있습니다.
        orgConfirmNum: '',

        // [취소 현금영수증 발행시 필수] 원본 현금영수증 거래일자
        // 원본 현금영수증 거래일자는 GetInfo API의 TradeDate 항목으로 확인할 수 있습니다.
        orgTradeDate: '',

        // [필수] 과세형태 (과세, 비과세) 중 기재
        taxationType: '과세',

        // [필수] 거래구분 (소득공제용, 지출증빙용) 중 기재
        tradeUsage: '소득공제용',

        // 거래유형 (일반, 도서공연, 대중교통) 중 기재
        tradeOpt: '일반',

        // [필수] 거래처 식별번호, 거래유형에 따라 작성
        // 소득공제용 - 주민등록/휴대폰/카드번호 기재가능
        // 지출증빙용 - 사업자번호/주민등록/휴대폰/카드번호 기재가능
        identityNum: '0101112222',

        // [필수] 가맹점 사업자번호
        franchiseCorpNum: testCorpNum,

        // 가맹점 상호
        franchiseCorpName: '가맹점 상호',

        // 가맹점 대표자성명
        franchiseCEOName: '가맹점 대표자 성명',

        // 가맹점 주소
        franchiseAddr: '가맹점 주소',

        // 가맹점 연락처
        franchiseTEL: '01012341234',

        // [필수] 공급가액
        supplyCost: '10000',

        // [필수] 세액
        tax: '1000',

        // [필수] 봉사료
        serviceFee: '0',

        // [필수] 거래금액 (공급가액 + 세액 + 봉사료)
        totalAmount: '11000',

        // 고객명
        customerName: '고객명',

        // 상품명
        itemName: '상품명',

        // 주문번호
        orderNumber: '주문번호',

        // 고객 메일주소
        email: 'test@test.com',

        // 고객 핸드폰번호
        hp: '010111222',

        // 고객 팩스번호
        fax: '000111222',

        // 발행시 알림문자 전송여부
        // 문자전송시 포인트가 차감되며 전송실패시 환불처리됨.
        smssendYN: false,
    };

    cashbillService.registIssue(testCorpNum, cashbill, stateMemo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 현금영수증을 [임시저장]합니다.
 * - [임시저장] 상태의 현금영수증은 발행(Issue API)을 호출해야만 국세청에 전송됩니다.
 * - 발행일 기준 오후 5시 이전에 발행된 현금영수증은 다음날 오후 2시에 국세청 전송결과를 확인할 수 있습니다.
 * - 현금영수증 국세청 전송 정책에 대한 정보는 "[현금영수증 API 연동매뉴얼] > 1.3. 국세청 전송정책"을 참조하시기 바랍니다.
 */
router.get('/register', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호, 1~24자리 숫자, 영문, '-', '_'를 조합하여 사업자별로 중복되지 않도록 작성
    var MgtKey = '20190109-001';

    // 현금영수증 항목
    var cashbill = {

        // [필수] 문서관리번호
        mgtKey: MgtKey,

        // [필수] 문서형태, (승인거래, 취소거래) 중 기재
        tradeType: '승인거래',

        // [취소 현금영수증 발행시 필수] 원본 현금영수증 국세청 승인번호
        // 국세청 승인번호는 GetInfo API의 ConfirmNum 항목으로 확인할 수 있습니다.
        // orgConfirmNum : '',

        // [필수] 과세형태 (과세, 비과세) 중 기재
        taxationType: '과세',

        // [필수] 거래구분 (소득공제용, 지출증빙용) 중 기재
        tradeUsage: '소득공제용',

        // 거래유형 (일반, 도서공연, 대중교통) 중 기재
        tradeOpt: '일반',

        // [필수] 거래처 식별번호, 거래유형에 따라 작성
        // 소득공제용 - 주민등록/휴대폰/카드번호 기재가능
        // 지출증빙용 - 사업자번호/주민등록/휴대폰/카드번호 기재가능
        identityNum: '01011112222',

        // [필수] 가맹점 사업자번호
        franchiseCorpNum: testCorpNum,

        // 가맹점 상호
        franchiseCorpName: '가맹점 상호',

        // 가맹점 대표자성명
        franchiseCEOName: '가맹점 대표자 성명',

        // 가맹점 주소
        franchiseAddr: '가맹점 주소',

        // 가맹점 연락처
        franchiseTEL: '01012341234',

        // [필수] 공급가액
        supplyCost: '15000',

        // [필수] 세액
        tax: '5000',

        // [필수] 봉사료
        serviceFee: '0',

        // [필수] 거래금액 (공급가액 + 세액 + 봉사료)
        totalAmount: '20000',

        // 고객명
        customerName: '고객명',

        // 상품명
        itemName: '상품명',

        // 주문번호
        orderNumber: '주문번호',

        // 고객 메일주소
        email: 'test@test.com',

        // 고객 핸드폰번호
        hp: '010111222',

        // 고객 팩스번호
        fax: '000111222',

        // 발행시 알림문자 전송여부
        // 문자전송시 포인트가 차감되며 전송실패시 환불처리됨.
        smssendYN: false,
    };

    cashbillService.register(testCorpNum, cashbill,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 현금영수증을 [수정]합니다.
 * - [임시저장] 상태의 현금영수증만 수정할 수 있습니다.
 * - 국세청에 신고된 현금영수증은 수정할 수 없으며, 취소 현금영수증을 발행하여 취소처리 할 수 있습니다.
 */
router.get('/update', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호, 1~24자리 숫자, 영문, '-', '_'를 조합하여 사업자별로 중복되지 않도록 작성
    var MgtKey = '20190109-002';

    // 현금영수증 항목
    var cashbill = {

        // [필수] 문서관리번호
        mgtKey: MgtKey,

        // [필수] 문서형태, (승인거래, 취소거래) 중 기재
        tradeType: '승인거래',

        // [취소 현금영수증 발행시 필수] 원본 현금영수증 국세청 승인번호
        // 국세청 승인번호는 GetInfo API의 ConfirmNum 항목으로 확인할 수 있습니다.
        // orgConfirmNum : '',

        // [필수] 과세형태 (과세, 비과세) 중 기재
        taxationType: '과세',

        // [필수] 거래구분 (소득공제용, 지출증빙용) 중 기재
        tradeUsage: '소득공제용',

        // 거래유형 (일반, 도서공연, 대중교통) 중 기재
        tradeOpt: '일반',

        // [필수] 거래처 식별번호, 거래유형에 따라 작성
        // 소득공제용 - 주민등록/휴대폰/카드번호 기재가능
        // 지출증빙용 - 사업자번호/주민등록/휴대폰/카드번호 기재가능
        identityNum: '01011112222',

        // [필수] 가맹점 사업자번호
        franchiseCorpNum: testCorpNum,

        // 가맹점 상호
        franchiseCorpName: '가맹점 상호_수정',

        // 가맹점 대표자성명
        franchiseCEOName: '가맹점 대표자 성명',

        // 가맹점 주소
        franchiseAddr: '가맹점 주소',

        // 가맹점 연락처
        franchiseTEL: '01012341234',

        // [필수] 공급가액
        supplyCost: '15000',

        // [필수] 세액
        tax: '5000',

        // [필수] 봉사료
        serviceFee: '0',

        // [필수] 거래금액 (공급가액 + 세액 + 봉사료)
        totalAmount: '20000',

        // 고객명
        customerName: '고객명',

        // 상품명
        itemName: '상품명',

        // 주문번호
        orderNumber: '주문번호',

        // 고객 메일주소
        email: 'test@test.com',

        // 고객 핸드폰번호
        hp: '010111222',

        // 고객 팩스번호
        fax: '000111222',

        // 발행시 알림문자 전송여부
        // 문자전송시 포인트가 차감되며 전송실패시 환불처리됨.
        smssendYN: false,
    };

    cashbillService.update(testCorpNum, MgtKey, cashbill,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 [임시저장] 현금영수증을 [발행]합니다.
 * - 발행일 기준 오후 5시 이전에 발행된 현금영수증은 다음날 오후 2시에 국세청 전송결과를 확인할 수 있습니다.
 * - 현금영수증 국세청 전송 정책에 대한 정보는 "[현금영수증 API 연동매뉴얼] > 1.3. 국세청 전송정책"을 참조하시기 바랍니다.
 */
router.get('/issue', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20190109-001';

    // 메모
    var memo = '발행메모';

    cashbillService.issue(testCorpNum, mgtKey, memo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * [발행완료] 상태의 현금영수증을 [발행취소]합니다.
 * - 발행취소는 국세청 전송전에만 가능합니다.
 * - 발행취소된 현금영수증은 국세청에 전송되지 않습니다.
 */
router.get('/cancelIssue', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20190109-001';

    // 메모
    var memo = '발행취소 메모';

    cashbillService.cancelIssue(testCorpNum, mgtKey, memo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 현금영수증을 [삭제]합니다.
 * - 현금영수증을 삭제하면 사용된 문서관리번호(mgtKey)를 재사용할 수 있습니다.
 * - 삭제가능한 문서 상태 : [임시저장], [발행취소]
 */
router.get('/delete', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20190109-001';

    cashbillService.delete(testCorpNum, mgtKey,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 취소현금영수증을 [즉시발행]합니다.
 * - 발행일 기준 오후 5시 이전에 발행된 현금영수증은 다음날 오후 2시에 국세청 전송결과를 확인할 수 있습니다.
 * - 현금영수증 국세청 전송 정책에 대한 정보는 "[현금영수증 API 연동매뉴얼] > 1.3. 국세청 전송정책"을 참조하시기 바랍니다.
 * - 취소현금영수증 작성방법 안내 - http://blog.linkhub.co.kr/702
 */
router.get('/revokeRegistIssue', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호, 1~24자리 숫자, 영문, '-', '_'를 조합하여 사업자별로 중복되지 않도록 작성
    var mgtKey = '20190109-101';

    // [취소 현금영수증 발행시 필수] 원본 현금영수증 국세청 승인번호
    // 국세청 승인번호는 GetInfo API의 ConfirmNum 항목으로 확인할 수 있습니다.
    orgConfirmNum = '081648147';

    // [취소 현금영수증 발행시 필수] 원본 현금영수증 거래일자
    // 원본 현금영수증 거래일자는 GetInfo API의 TradeDate 항목으로 확인할 수 있습니다.
    orgTradeDate = '20190104';

    cashbillService.revokeRegistIssue(testCorpNum, mgtKey, orgConfirmNum, orgTradeDate,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 (부분)취소현금영수증을 [즉시발행]합니다.
 * - 발행일 기준 오후 5시 이전에 발행된 현금영수증은 다음날 오후 2시에 국세청 전송결과를 확인할 수 있습니다.
 * - 현금영수증 국세청 전송 정책에 대한 정보는 "[현금영수증 API 연동매뉴얼] > 1.3. 국세청 전송정책"을 참조하시기 바랍니다.
 */
router.get('/revokeRegistIssue_part', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    // 문서관리번호, 1~24자리 숫자, 영문, '-', '_'를 조합하여 사업자별로 중복되지 않도록 작성
    var mgtKey = '20190109-102';

    // [취소 현금영수증 발행시 필수] 원본 현금영수증 국세청 승인번호
    // 국세청 승인번호는 GetInfo API의 ConfirmNum 항목으로 확인할 수 있습니다.
    var orgConfirmNum = '081648147';

    // [취소 현금영수증 발행시 필수] 원본 현금영수증 거래일자
    // 원본 현금영수증 거래일자는 GetInfo API의 TradeDate 항목으로 확인할 수 있습니다.
    var orgTradeDate = '20190104';

    // 안내문자 전송여부
    var smssendYN = false;

    // 메모
    var memo = '부분취소발행 메모';

    // 부분취소여부, true-부분취소, false-전체취소
    var isPartCancel = true;

    // 취소사유, 1-거래취소, 2-오류발급취소, 3-기타
    var cancelType = 1;

    // [취소] 공급가액
    var supplyCost = "7000";

    // [취소] 세액
    var tax = "700";

    // [취소] 봉사료
    var serviceFee = "0";

    // [취소] 합계금액
    var totalAmount = "7700";

    cashbillService.revokeRegistIssue(testCorpNum, mgtKey, orgConfirmNum, orgTradeDate, smssendYN, memo, testUserID,
        isPartCancel, cancelType, supplyCost, tax, serviceFee, totalAmount,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 취소현금영수증을 [임시저장]합니다.
 * - [임시저장] 상태의 현금영수증은 발행(Issue API)을 호출해야만 국세청에 전송됩니다.
 * - 발행일 기준 오후 5시 이전에 발행된 현금영수증은 다음날 오후 2시에 국세청 전송결과를 확인할 수 있습니다.
 * - 현금영수증 국세청 전송 정책에 대한 정보는 "[현금영수증 API 연동매뉴얼] > 1.3. 국세청 전송정책"을 참조하시기 바랍니다.
 */
router.get('/revokeRegister', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호, 1~24자리 숫자, 영문, '-', '_'를 조합하여 사업자별로 중복되지 않도록 작성
    var mgtKey = '20190109-103';

    // [취소 현금영수증 발행시 필수] 원본 현금영수증 국세청 승인번호
    // 국세청 승인번호는 GetInfo API의 ConfirmNum 항목으로 확인할 수 있습니다.
    orgConfirmNum = '081648147';

    // [취소 현금영수증 발행시 필수] 원본 현금영수증 거래일자
    // 원본 현금영수증 거래일자는 GetInfo API의 TradeDate 항목으로 확인할 수 있습니다.
    orgTradeDate = '20190104';

    cashbillService.revokeRegister(testCorpNum, mgtKey, orgConfirmNum, orgTradeDate,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 (부분)취소현금영수증을 [임시저장]합니다.
 * - [임시저장] 상태의 현금영수증은 발행(Issue API)을 호출해야만 국세청에 전송됩니다.
 * - 발행일 기준 오후 5시 이전에 발행된 현금영수증은 다음날 오후 2시에 국세청 전송결과를 확인할 수 있습니다.
 * - 현금영수증 국세청 전송 정책에 대한 정보는 "[현금영수증 API 연동매뉴얼] > 1.3. 국세청 전송정책"을 참조하시기 바랍니다.
 * - 취소현금영수증 작성방법 안내 - http://blog.linkhub.co.kr/702
 */
router.get('/revokeRegister_part', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    // 문서관리번호, 1~24자리 숫자, 영문, '-', '_'를 조합하여 사업자별로 중복되지 않도록 작성
    var mgtKey = '20190109-004';

    // 원본 현금영수증 국세청 승인번호
    // 국세청 승인번호는 GetInfo API의 ConfirmNum 항목으로 확인할 수 있습니다.
    var orgConfirmNum = '081648147';

    // 원본 현금영수증 거래일자
    // 원본 현금영수증 거래일자는 GetInfo API의 TradeDate 항목으로 확인할 수 있습니다.
    var orgTradeDate = '20190104';

    // 안내문자 전송여부
    var smssendYN = false;

    // 부분취소여부, true-부분취소, false-전체취소
    var isPartCancel = true;

    // 취소사유, 1-거래취소, 2-오류발급취소, 3-기타
    var cancelType = 1;

    // [취소] 공급가액
    var supplyCost = "6000";

    // [취소] 세액
    var tax = "600";

    // [취소] 봉사료
    var serviceFee = "0";

    // [취소] 합계금액
    var totalAmount = "6600";

    cashbillService.revokeRegister(testCorpNum, mgtKey, orgConfirmNum, orgTradeDate, smssendYN, testUserID,
        isPartCancel, cancelType, supplyCost, tax, serviceFee, totalAmount,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 현금영수증 상태/요약 정보를 확인합니다.
 * - 응답항목에 대한 자세한 정보는 "[현금영수증 API 연동매뉴얼] > 4.2. 현금영수증 상태정보 구성"을 참조하시기 바랍니다.
 */
router.get('/getInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20190109-001';

    cashbillService.getInfo(testCorpNum, mgtKey,
        function (result) {
            res.render('Cashbill/CashbillInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 대량의 현금영수증 상태/요약 정보를 확인합니다. (최대 1000건)
 * - 응답항목에 대한 자세한 정보는 "[현금영수증 API 연동매뉴얼] > 4.2. 현금영수증 상태정보 구성"을 참조하시기 바랍니다.
 */
router.get('/getInfos', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호 배열, 최대 1000건
    var mgtKeyList = ['20190109-001', '20190109-002', '20190109-003'];

    cashbillService.getInfos(testCorpNum, mgtKeyList,
        function (result) {
            res.render('Cashbill/CashbillInfos', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 현금영수증 1건의 상세정보를 조회합니다.
 * - 응답항목에 대한 자세한 사항은 "[현금영수증 API 연동매뉴얼] > 4.1. 현금영수증 구성" 을 참조하시기 바랍니다.
 */
router.get('/getDetailInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20190109-001';

    cashbillService.getDetailInfo(testCorpNum, mgtKey,
        function (result) {
            res.render('Cashbill/CashbillDetail', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 검색조건을 사용하여 현금영수증 목록을 조회합니다.
 * - 응답항목에 대한 자세한 사항은 "[현금영수증 API 연동매뉴얼] > 4.2. 현금영수증 상태정보 구성" 을 참조하시기 바랍니다.
 */
router.get('/search', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 검색일자 유형, R-등록일자, T-거래일자, I-발행일자
    var DType = 'R';

    // 시작일자, 작성형식(yyyyMMdd)
    var SDate = '20181201';

    // 종료일자, 작성형식(yyyyMMdd)
    var EDate = '20190109';

    // 문서상태코드 배열, 2,3번째 자리에 와일드카드(*) 사용가능
    var State = ['1**', '3**', '4**'];

    // 현금영수증 문서형태 배열, N-일반현금영수증, C-취소현금영수증
    var TradeType = ['N', 'C'];

    // 현금영수증 거래구분 배열, P-소득공제용, C-지출증빙용
    var TradeUsage = ['P', 'C'];

    // 현금영수증 거래유형 배열 N-일반, B-도서공연, T-대중교통
    var TradeOpt = ['N', 'B', 'T'];

    // 과세유형 배열, T-과세, N-비과세
    var TaxationType = ['T', 'N'];

    // 현금영수증 식별번호, 미기재시 전체조회
    var QString = '';

    // 정렬방향, D-내림차순, A-오름차순
    var Order = 'D';

    // 페이지 번호
    var Page = 1;

    // 페이지당 검색개수, 최대 1000건
    var PerPage = 50;

    cashbillService.search(testCorpNum, DType, SDate, EDate, State, TradeType,
        TradeUsage, TradeOpt, TaxationType, QString, Order, Page, PerPage,
        function (result) {
            res.render('Cashbill/Search', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 현금영수증 상태 변경이력을 확인합니다.
 * - 상태 변경이력 확인(GetLogs API) 응답항목에 대한 자세한 정보는
 *   "[현금영수증 API 연동매뉴얼] > 3.3.5 상태 변경이력 확인" 을 참조하시기 바랍니다.
 */
router.get('/getLogs', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20170306-01';

    cashbillService.getLogs(testCorpNum, mgtKey,
        function (result) {
            res.render('Cashbill/CashbillLogs', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 현금영수증 문서함 팝업 URL을 반환합니다.
 * - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
 */
router.get('/getURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // PBOX(발행문서함), TBOX(임시문서함), WRITE(현금영수증 작성)
    var TOGO = 'PBOX';

    cashbillService.getURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 현금영수증 보기 팝업 URL을 반환합니다.
 * - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
 */
router.get('/getPopUpURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20190109-001';

    cashbillService.getPopUpURL(testCorpNum, mgtKey,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 현금영수증 인쇄팝업 URL을 반환합니다.
 * - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
 */
router.get('/getPrintURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20190109-001';

    cashbillService.getPrintURL(testCorpNum, mgtKey,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 대량의 현금영수증 인쇄팝업 URL을 반환합니다. (최대 100건)
 * - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
 */
router.get('/getMassPrintURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호 배열, 최대 100건
    var mgtKeyList = ['20190109-001', '20190109-002', '20190109-002'];

    cashbillService.getMassPrintURL(testCorpNum, mgtKeyList,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 현금영수증 수신메일 링크주소를 반환합니다.
 * - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
 */
router.get('/getMailURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20190109-001';

    cashbillService.getMailURL(testCorpNum, mgtKey,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌에 로그인 상태로 접근할 수 있는 팝업 URL을 반환합니다.
 * - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
 */
router.get('/getAccessURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    cashbillService.getAccessURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 현금영수증 발행 안내메일을 재전송합니다.
 */
router.get('/sendEmail', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20190109-001';

    // 수신메일주소
    var receiver = 'test@test.com';

    cashbillService.sendEmail(testCorpNum, mgtKey, receiver,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 알림문자를 전송합니다. (단문/SMS - 한글 최대 45자)
 * - 알림문자 전송시 포인트가 차감됩니다. (전송실패시 환불처리)
 * - 전송내역 확인은 "팝빌 로그인" > [문자 팩스] > [문자] > [전송내역] 탭에서 전송결과를 확인할 수 있습니다.
 */
router.get('/sendSMS', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20190109-001';

    // 발신번호
    var senderNum = '07043042991';

    // 수신번호
    var receiverNum = '000111222';

    // 메세지 내용, 90byte 초과시 길이가 조정되어 전송됨
    var contents = '현금영수증 API 문자전송 테스트'

    cashbillService.sendSMS(testCorpNum, mgtKey, senderNum, receiverNum, contents,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 현금영수증을 팩스전송합니다.
 * - 팩스 전송 요청시 포인트가 차감됩니다. (전송실패시 환불처리)
 * - 전송내역 확인은 "팝빌 로그인" > [문자 팩스] > [팩스] > [전송내역] 메뉴에서 전송결과를 확인할 수 있습니다.
 */
router.get('/sendFAX', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서관리번호
    var mgtKey = '20190109-001';

    // 발신번호
    var senderNum = '07043042991';

    // 수신팩스번호
    var receiverNum = '000111222';

    cashbillService.sendFAX(testCorpNum, mgtKey, senderNum, receiverNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 현금영수증 관련 메일전송 항목에 대한 전송여부를 목록을 반환합니다.
 */
router.get('/listEmailConfig', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    cashbillService.listEmailConfig(testCorpNum,
        function (result) {
            res.render('Cashbill/ListEmailConfig', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 현금영수증 관련 메일전송 항목에 대한 전송여부를 수정합니다.
 * 메일전송유형
 * CSH_ISSUE : 고객에게 현금영수증이 발행 되었음을 알려주는 메일 입니다.
 * CSH_CANCEL : 고객에게 현금영수증이 발행취소 되었음을 알려주는 메일 입니다.
 */
router.get('/updateEmailConfig', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 메일 전송 유형
    var emailType = 'CSH_ISSUE';

    // 전송 여부 (true = 전송, false = 미전송)
    var sendYN = true;

    cashbillService.updateEmailConfig(testCorpNum, emailType, sendYN,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 잔여포인트를 확인합니다.
 * - 과금방식이 파트너과금인 경우 파트너 잔여포인트(GetPartnerBalance API)를 통해 확인하시기 바랍니다.
 */
router.get('/getBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    cashbillService.getBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 연동회원 포인트 충전 URL을 반환합니다.
 * - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
 */
router.get('/getChargeURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    cashbillService.getChargeURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너의 잔여포인트를 확인합니다.
 * - 과금방식이 연동과금인 경우 연동회원 잔여포인트(GetBalance API)를 이용하시기 바랍니다.
 */
router.get('/getPartnerBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    cashbillService.getPartnerBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너 포인트 충전 팝업 URL을 반환합니다.
 * - 반환된 URL은 보안정책에 따라 30초의 유효시간을 갖습니다.
 */
router.get('/getPartnerURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // CHRG(포인트충전)
    var TOGO = 'CHRG';

    cashbillService.getPartnerURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 현금영수증 발행단가를 확인합니다.
 */
router.get('/getUnitCost', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    cashbillService.getUnitCost(testCorpNum,
        function (unitCost) {
            res.render('result', {path: req.path, result: unitCost});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 현금영수증 API 서비스 과금정보를 확인합니다.
 */
router.get('/getChargeInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    cashbillService.getChargeInfo(testCorpNum,
        function (result) {
            res.render('Base/getChargeInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 해당 사업자의 파트너 연동회원 가입여부를 확인합니다.
 */
router.get('/checkIsMember', function (req, res, next) {

    // 조회할 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    cashbillService.checkIsMember(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 회원아이디 중복여부를 확인합니다.
 */
router.get('/checkID', function (req, res, next) {

    // 조회할 아이디
    var testID = 'testkorea';

    cashbillService.checkID(testID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 연동회원 가입을 요청합니다.
 */
router.get('/joinMember', function (req, res, next) {

    // 회원정보
    var joinInfo = {

        // 회원 아이디 (6자 이상 50자 미만)
        ID: 'userid',

        // 회원 비밀번호 (6자 이상 20자 미만)
        PWD: 'this_is_password',

        // 링크아이디
        LinkID: 'TESTER',

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

    cashbillService.joinMember(joinInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 확인합니다.
 */
router.get('/getCorpInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    cashbillService.getCorpInfo(testCorpNum,
        function (result) {
            res.render('Base/getCorpInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 수정합니다
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

    cashbillService.updateCorpInfo(testCorpNum, corpInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 담당자를 신규로 등록합니다.
 */
router.get('/registContact', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 담당자 정보
    var contactInfo = {

        // 아이디 (6자 이상 50자 미만)
        id: 'testkorea03033',

        // 비밀번호 (6자 이상 20자 미만)
        pwd: 'thisispassword',

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

        // 전체조회여부, 회사조회(true), 개인조회(false)
        searchAllAllowYN: true

    };

    cashbillService.registContact(testCorpNum, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 담당자 목록을 확인합니다.
 */
router.get('/listContact', function (req, res, next) {

    // 조회할 아이디
    var testCorpNum = '1234567890';

    cashbillService.listContact(testCorpNum,
        function (result) {
            res.render('Base/listContact', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 담당자 정보를 수정합니다.
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

        // 전체조회여부, 회사조회(true), 개인조회(false)
        searchAllAllowYN: true

    };

    cashbillService.updateContact(testCorpNum, testUserID, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

module.exports = router;
