var express = require('express');
var router = express.Router();
var popbill = require('popbill');
var fs = require('fs');
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

    // 팝빌 API 서비스 고정 IP 사용여부(GA)
    UseStaticIP: false,

    // 로컬서버 시간 사용여부 true-사용(기본값-권장), false-미사용
    UseLocalTimeYN: true,

    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});


/*
 * 전자세금계산서 API 서비스 클래스 생성
 */
var taxinvoiceService = popbill.TaxinvoiceService();


/*
 * Taxinovice API Index 목록
 */
router.get('/', function (req, res, next) {
    res.render('Taxinvoice/index', {});
});


/*
 * 파트너가 세금계산서 관리 목적으로 할당하는 문서번호의 사용여부를 확인합니다.
 * - 문서번호는 최대 24자리 영문 대소문자, 숫자, 특수문자('-','_')로 구성 합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#CheckMgtKeyInUse
 */
router.get('/checkMgtKeyInUse', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호, 최대 24자리, 영문, 숫자 '-', '_'를 조합하여 사업자별로 중복되지 않도록 구성
    var mgtKey = '20210801-001';

    taxinvoiceService.checkMgtKeyInUse(testCorpNum, keyType, mgtKey,
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
 * 작성된 세금계산서 데이터를 팝빌에 저장과 동시에 발행(전자서명)하여 "발행완료" 상태로 처리합니다.
 * - 세금계산서 국세청 전송 정책 : https://docs.popbill.com/taxinvoice/ntsSendPolicy?lang=node
 * - https://docs.popbill.com/taxinvoice/node/api#RegistIssue
 */
router.get('/registIssue', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서번호, 최대 24자리, 영문, 숫자 '-', '_'를 조합하여 사업자별로 중복되지 않도록 구성
    var mgtKey = '20210801-001';

    // 세금계산서 항목
    var Taxinvoice = {

        // [필수] 작성일자, 날짜형식 yyyyMMdd
        writeDate: '20210801',

        // [필수] 과금방향, (정과금, 역과금) 중 기재, 역과금은 역발행의 경우만 가능
        chargeDirection: '정과금',

        // [필수] 발행형태, (정발행, 역발행, 위수탁) 중 기재
        issueType: '정발행',

        // [필수] (영수, 청구) 중 기재
        purposeType: '영수',

        // [필수] 과세형태, (과세, 영세, 면세) 중 기재
        taxType: '과세',


        /************************************************************************
         *                              공급자 정보
         **************************************************************************/

        // [필수] 공급자 사업자번호, '-' 제외 10자리
        invoicerCorpNum: testCorpNum,

        // [정발행시 필수] 문서번호, 최대 24자리, 영문, 숫자 '-', '_'를 조합하여 사업자별로 중복되지 않도록 구성
        invoicerMgtKey: mgtKey,

        // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
        invoicerTaxRegID: '',

        // [필수] 공급자 상호
        invoicerCorpName: '공급자 상호',

        // [필수] 대표자 성명
        invoicerCEOName: '대표자 성명',

        // 공급자 주소
        invoicerAddr: '공급자 주소',

        // 공급자 종목
        invoicerBizClass: '공급자 업종',

        // 공급자 업태
        invoicerBizType: '공급자 업태',

        // 공급자 담당자명
        invoicerContactName: '공급자 담당자명',

        // 공급자 연락처
        invoicerTEL: '070-4304-2991',

        // 공급자 휴대폰번호
        invoicerHP: '010-000-111',

        // 공급자 메일주소
        invoicerEmail: 'test@test.com',

        // 정발행시 알림문자 전송여부
        // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
        invoicerSMSSendYN: false,


        /************************************************************************
         *                           공급받는자 정보
         **************************************************************************/

        // [필수] 공급받는자 구분, (사업자, 개인, 외국인) 중 기재
        invoiceeType: '사업자',

        // [필수] 공급받는자 사업자번호, '-'제외 10자리
        invoiceeCorpNum: '8888888888',

        // [역발행시 필수] 공급받는자 문서번호
        invoiceeMgtKey: '',

        // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
        invoiceeTaxRegID: '',

        // [필수] 공급받는자 상호
        invoiceeCorpName: '공급받는자 상호',

        // [필수] 공급받는자 대표자 성명
        invoiceeCEOName: '공급받는자 대표자 성명',

        // 공급받는자 주소
        invoiceeAddr: '공급받는자 주소',

        // 공급받는자 종목
        invoiceeBizClass: '공급받는자 종목',

        // 공급받는자 업태
        invoiceeBizType: '공급받는자 업태',

        // 공급받는자 담당자명
        invoiceeContactName1: '공급받는자 담당자명',

        // 공급받는자 연락처
        invoiceeTEL1: '010-111-222',

        // 공급받는자 휴대폰번호
        invoiceeHP1: '070-111-222',

        // 공급받는자 이메일 주소
        // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
        // 실제 거래처의 메일주소가 기재되지 않도록 주의
        invoiceeEmail1: 'test2@test.com',

        // 역발행시 알림문자 전송여부
        // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
        invoiceeSMSSendYN: false,


        /************************************************************************
         *                           세금계산서 기재정보
         **************************************************************************/

        // [필수] 공급가액 합계
        supplyCostTotal: '10000',

        // [필수] 세액합계
        taxTotal: '1000',

        // [필수] 합계금액 (공급가액 합계 + 세액 합계)
        totalAmount: '11000',

        // 기재 상 '일련번호'' 항목
        serialNum: '123',

        // 기재 상 '현금'' 항목
        cash: '',

        // 기재 상 '수표' 항목
        chkBill: '',

        // 기재 상 '어음' 항목
        note: '',

        // 기재 상 '외상' 항목
        credit: '',

        // 기재 상 '비고' 항목
        remark1: '비고',
        remark2: '비고2',
        remark3: '비고3',

        // 기재 상 '권' 항목, 최대값 32767
        kwon: '',

        // 기재 상 '호' 항목, 최대값 32767
        ho: '',

        // 사업자등록증 이미지 첨부여부
        businessLicenseYN: false,

        // 통장사본 이미지 첨부여부
        bankBookYN: false,


        /************************************************************************
         *                           상세항목(품목) 정보
         **************************************************************************/

        detailList: [
            {
                serialNum: 1,                // 일련번호, 1부터 순차기재
                purchaseDT: '20210801',      // 거래일자, 형식 : yyyyMMdd
                itemName: '품명1',
                spec: '규격',
                qty: '1',                    // 수량, 소수점 2자리까지 기재 가능
                unitCost: '5000',           // 단가, 소수점 2자리까지 기재 가능
                supplyCost: '5000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                tax: '500',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                remark: '비고'
            },
            {
                serialNum: 2,                // 일련번호, 1부터 순차기재
                purchaseDT: '20210801',      // 거래일자, 형식 : yyyyMMdd
                itemName: '품명2',
                spec: '규격',
                qty: '1',                    // 수량, 소수점 2자리까지 기재 가능
                unitCost: '5000',           // 단가, 소수점 2자리까지 기재 가능
                supplyCost: '5000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                tax: '500',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                remark: '비고'
            }
        ],


        /************************************************************************
         *                         수정세금계산서 기재정보
         * - 수정세금계산서를 작성하는 경우에만 값을 기재합니다.
         * - 수정세금계산서 관련 정보는 연동매뉴얼 또는 개발가이드 링크 참조
         * - [참고] 수정세금계산서 작성방법 안내 - https://docs.popbill.com/taxinvoice/modify?lang=node
         **************************************************************************/

        // [수정세금계산서 발행시 필수] 수정사유코드, 수정사유에 따라 1~6 숫자 기재
        modifyCode: '',

        // [수정세금계산서 발행시 필수] 원본세금계산서 국세청승인번호 기재
        orgNTSConfirmNum: '',

        /************************************************************************
         *                             추가담당자 정보
         * - 세금계산서 발행안내 메일을 수신받을 공급받는자 담당자가 다수인 경우
         * 추가 담당자 정보를 등록하여 발행안내메일을 다수에게 전송할 수 있습니다. (최대 5명)
         **************************************************************************/

        // 추가담당자 정보
        addContactList: [
            {
                // 일련번호, 1부터 순차기재
                serialNum: 1,

                // 담당자명
                contactName: '담당자 성명',

                // 담당자 메일
                // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
                // 실제 거래처의 메일주소가 기재되지 않도록 주의
                email: 'test2@test.com'
            },
            {
                // 일련번호, 1부터 순차기재
                serialNum: 2,

                // 담당자명
                contactName: '담당자 성명 2',

                // 담당자 메일
                // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
                // 실제 거래처의 메일주소가 기재되지 않도록 주의
                email: 'test3@test.com'
            }
        ]
    };

    taxinvoiceService.registIssue(testCorpNum, Taxinvoice,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message, ntsConfirmNum: result.ntsConfirmNum});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


/*
 * 최대 100건의 세금계산서 발행을 한번의 요청으로 접수합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#BulkSubmit
 */
router.get('/bulkSubmit', function(req, res, next) {
    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 제출 아이디
    var submitID = '20210818NODE-1';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    // 세금계산서 객체정보 목록
    var taxinvoiceList = [];

    // 지연발행 강제여부
    // - 지연발행 세금계산서를 발행하는 경우, 가산세가 부과될 수 있습니다.
    var forceIssue = false;

    for(var i = 0; i < 100; i++){
        // 세금계산서 항목
       var Taxinvoice = {

           // [필수] 작성일자, 날짜형식 yyyyMMdd
           writeDate: '20210818',

           // [필수] 과금방향, (정과금, 역과금) 중 기재, 역과금은 역발행의 경우만 가능
           chargeDirection: '정과금',

           // [필수] 발행형태, (정발행, 역발행, 위수탁) 중 기재
           issueType: '정발행',

           // [필수] (영수, 청구) 중 기재
           purposeType: '영수',

           // [필수] 과세형태, (과세, 영세, 면세) 중 기재
           taxType: '과세',


           /************************************************************************
            *                              공급자 정보
            **************************************************************************/

           // [필수] 공급자 사업자번호, '-' 제외 10자리
           invoicerCorpNum: testCorpNum,

           // [정발행시 필수] 문서번호, 최대 24자리, 영문, 숫자 '-', '_'를 조합하여 사업자별로 중복되지 않도록 구성
           invoicerMgtKey: submitID + i,

           // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
           invoicerTaxRegID: '',

           // [필수] 공급자 상호
           invoicerCorpName: '공급자 상호',

           // [필수] 대표자 성명
           invoicerCEOName: '대표자 성명',

           // 공급자 주소
           invoicerAddr: '공급자 주소',

           // 공급자 종목
           invoicerBizClass: '공급자 업종',

           // 공급자 업태
           invoicerBizType: '공급자 업태',

           // 공급자 담당자명
           invoicerContactName: '공급자 담당자명',

           // 공급자 연락처
           invoicerTEL: '070-4304-2991',

           // 공급자 휴대폰번호
           invoicerHP: '010-000-111',

           // 공급자 메일주소
           invoicerEmail: 'test@test.com',

           // 정발행시 알림문자 전송여부
           // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
           invoicerSMSSendYN: false,


           /************************************************************************
            *                           공급받는자 정보
            **************************************************************************/

           // [필수] 공급받는자 구분, (사업자, 개인, 외국인) 중 기재
           invoiceeType: '사업자',

           // [필수] 공급받는자 사업자번호, '-'제외 10자리
           invoiceeCorpNum: '8888888888',

           // [역발행시 필수] 공급받는자 문서번호
           invoiceeMgtKey: '',

           // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
           invoiceeTaxRegID: '',

           // [필수] 공급받는자 상호
           invoiceeCorpName: '공급받는자 상호',

           // [필수] 공급받는자 대표자 성명
           invoiceeCEOName: '공급받는자 대표자 성명',

           // 공급받는자 주소
           invoiceeAddr: '공급받는자 주소',

           // 공급받는자 종목
           invoiceeBizClass: '공급받는자 종목',

           // 공급받는자 업태
           invoiceeBizType: '공급받는자 업태',

           // 공급받는자 담당자명
           invoiceeContactName1: '공급받는자 담당자명',

           // 공급받는자 연락처
           invoiceeTEL1: '010-111-222',

           // 공급받는자 휴대폰번호
           invoiceeHP1: '070-111-222',

           // 공급받는자 이메일 주소
           // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
           // 실제 거래처의 메일주소가 기재되지 않도록 주의
           invoiceeEmail1: 'test2@test.com',

           // 역발행시 알림문자 전송여부
           // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
           invoiceeSMSSendYN: false,


           /************************************************************************
            *                           세금계산서 기재정보
            **************************************************************************/

           // [필수] 공급가액 합계
           supplyCostTotal: '10000',

           // [필수] 세액합계
           taxTotal: '1000',

           // [필수] 합계금액 (공급가액 합계 + 세액 합계)
           totalAmount: '11000',

           // 기재 상 '일련번호'' 항목
           serialNum: '123',

           // 기재 상 '현금'' 항목
           cash: '',

           // 기재 상 '수표' 항목
           chkBill: '',

           // 기재 상 '어음' 항목
           note: '',

           // 기재 상 '외상' 항목
           credit: '',

           // 기재 상 '비고' 항목
           remark1: '비고',
           remark2: '비고2',
           remark3: '비고3',

           // 기재 상 '권' 항목, 최대값 32767
           kwon: '',

           // 기재 상 '호' 항목, 최대값 32767
           ho: '',

           // 사업자등록증 이미지 첨부여부
           businessLicenseYN: false,

           // 통장사본 이미지 첨부여부
           bankBookYN: false,


           /************************************************************************
            *                           상세항목(품목) 정보
            **************************************************************************/

           detailList: [
               {
                   serialNum: 1,                // 일련번호, 1부터 순차기재
                   purchaseDT: '20210801',      // 거래일자, 형식 : yyyyMMdd
                   itemName: '품명1',
                   spec: '규격',
                   qty: '1',                    // 수량, 소수점 2자리까지 기재 가능
                   unitCost: '5000',           // 단가, 소수점 2자리까지 기재 가능
                   supplyCost: '5000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                   tax: '500',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                   remark: '비고'
               },
               {
                   serialNum: 2,                // 일련번호, 1부터 순차기재
                   purchaseDT: '20210801',      // 거래일자, 형식 : yyyyMMdd
                   itemName: '품명2',
                   spec: '규격',
                   qty: '1',                    // 수량, 소수점 2자리까지 기재 가능
                   unitCost: '5000',           // 단가, 소수점 2자리까지 기재 가능
                   supplyCost: '5000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                   tax: '500',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                   remark: '비고'
               }
           ],

           /************************************************************************
            *                         수정세금계산서 기재정보
            * - 수정세금계산서를 작성하는 경우에만 값을 기재합니다.
            * - 수정세금계산서 관련 정보는 연동매뉴얼 또는 개발가이드 링크 참조
            * - [참고] 수정세금계산서 작성방법 안내 - https://docs.popbill.com/taxinvoice/modify?lang=node
            **************************************************************************/

           // [수정세금계산서 발행시 필수] 수정사유코드, 수정사유에 따라 1~6 숫자 기재
           modifyCode: '',

           // [수정세금계산서 발행시 필수] 원본세금계산서 국세청승인번호 기재
           orgNTSConfirmNum: '',

           /************************************************************************
            *                             추가담당자 정보
            * - 세금계산서 발행안내 메일을 수신받을 공급받는자 담당자가 다수인 경우
            * 추가 담당자 정보를 등록하여 발행안내메일을 다수에게 전송할 수 있습니다. (최대 5명)
            **************************************************************************/

           // 추가담당자 정보
           addContactList: [
               {
                   // 일련번호, 1부터 순차기재
                   serialNum: 1,

                   // 담당자명
                   contactName: '담당자 성명',

                   // 담당자 메일
                   // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
                   // 실제 거래처의 메일주소가 기재되지 않도록 주의
                   email: 'test2@test.com'
               },
               {
                   // 일련번호, 1부터 순차기재
                   serialNum: 2,

                   // 담당자명
                   contactName: '담당자 성명 2',

                   // 담당자 메일
                   // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
                   // 실제 거래처의 메일주소가 기재되지 않도록 주의
                   email: 'test3@test.com'
               }
           ]
       };
       // 세금계산서 객체 목록에 추가
       taxinvoiceList.push(Taxinvoice);
    }
    taxinvoiceService.bulkSubmit(testCorpNum, submitID, taxinvoiceList, forceIssue, testUserID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message, receiptID: result.receiptID});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 접수시 기재한 SubmitID를 사용하여 세금계산서 접수결과를 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetBulkResult
 */
router.get('/getBulkResult', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 초대량 발행 접수시 기재한 제출아이디
    var submitID = '20210818NODE-1';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    taxinvoiceService.getBulkResult(testCorpNum, submitID, testUserID,
        function (result) {
            res.render('Taxinvoice/BulkResult', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 작성된 세금계산서 데이터를 팝빌에 저장합니다.
 * - "임시저장" 상태의 세금계산서는 발행(Issue)함수를 호출하여 "발행완료" 처리한 경우에만 국세청으로 전송됩니다.
 * - 정발행시 임시저장(Register)과 발행(Issue)을 한번의 호출로 처리하는 즉시발행(RegistIssue API) 프로세스 연동을 권장합니다.
 * - 역발행시 임시저장(Register)과 역발행요청(Request)을 한번의 호출로 처리하는 즉시요청(RegistRequest API) 프로세스 연동을 권장합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#Register
 */
router.get('/register', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 문서번호, 최대 24자리, 영문, 숫자 '-', '_'를 조합하여 사업자별로 중복되지 않도록 구성
    var mgtKey = '20210801-033';

    // 세금계산서 항목
    var Taxinvoice = {

        // [필수] 작성일자, 날짜형식 yyyyMMdd
        writeDate: '20210801',

        // [필수] 과금방향, (정과금, 역과금) 중 기재, 역과금은 역발행의 경우만 가능
        chargeDirection: '정과금',

        // [필수] 발행형태, (정발행, 역발행, 위수탁) 중 기재
        issueType: '정발행',

        // [필수] (영수, 청구) 중 기재
        purposeType: '영수',

        // [필수] 과세형태, (과세, 영세, 면세) 중 기재
        taxType: '과세',


        /************************************************************************
         *                              공급자 정보
         **************************************************************************/

        // [필수] 공급자 사업자번호, '-' 제외 10자리
        invoicerCorpNum: testCorpNum,

        // [정발행시 필수] 문서번호, 최대 24자리, 영문, 숫자 '-', '_'를 조합하여 사업자별로 중복되지 않도록 구성
        invoicerMgtKey: mgtKey,

        // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
        invoicerTaxRegID: '',

        // [필수] 공급자 상호
        invoicerCorpName: '공급자 상호',

        // [필수] 대표자 성명
        invoicerCEOName: '대표자 성명',

        // 공급자 주소
        invoicerAddr: '공급자 주소',

        // 공급자 종목
        invoicerBizClass: '공급자 업종',

        // 공급자 업태
        invoicerBizType: '공급자 업태',

        // 공급자 담당자명
        invoicerContactName: '공급자 담당자명',

        // 공급자 연락처
        invoicerTEL: '070-4304-2991',

        // 공급자 휴대폰번호
        invoicerHP: '010-000-111',

        // 공급자 메일주소
        invoicerEmail: 'test@test.com',

        // 정발행시 알림문자 전송여부
        // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
        invoicerSMSSendYN: false,


        /************************************************************************
         *                           공급받는자 정보
         **************************************************************************/

        // [필수] 공급받는자 구분, (사업자, 개인, 외국인) 중 기재
        invoiceeType: '사업자',

        // [필수] 공급받는자 사업자번호, '-'제외 10자리
        invoiceeCorpNum: '8888888888',

        // [역발행시 필수] 공급받는자 문서번호
        invoiceeMgtKey: '',

        // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
        invoiceeTaxRegID: '',

        // [필수] 공급받는자 상호
        invoiceeCorpName: '공급받는자 상호',

        // [필수] 공급받는자 대표자 성명
        invoiceeCEOName: '공급받는자 대표자 성명',

        // 공급받는자 주소
        invoiceeAddr: '공급받는자 주소',

        // 공급받는자 종목
        invoiceeBizClass: '공급받는자 종목',

        // 공급받는자 업태
        invoiceeBizType: '공급받는자 업태',

        // 공급받는자 담당자명
        invoiceeContactName1: '공급받는자 담당자명',

        // 공급받는자 연락처
        invoiceeTEL1: '010-111-222',

        // 공급받는자 휴대폰번호
        invoiceeHP1: '070-111-222',

        // 공급받는자 이메일 주소
        // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
        // 실제 거래처의 메일주소가 기재되지 않도록 주의
        invoiceeEmail1: 'test2@test.com',

        // 역발행시 알림문자 전송여부
        // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
        invoiceeSMSSendYN: false,


        /************************************************************************
         *                           세금계산서 기재정보
         **************************************************************************/

        // [필수] 공급가액 합계
        supplyCostTotal: '10000',

        // [필수] 세액합계
        taxTotal: '1000',

        // [필수] 합계금액 (공급가액 합계 + 세액 합계)
        totalAmount: '11000',

        // 기재 상 '일련번호'' 항목
        serialNum: '123',

        // 기재 상 '현금'' 항목
        cash: '',

        // 기재 상 '수표' 항목
        chkBill: '',

        // 기재 상 '어음' 항목
        note: '',

        // 기재 상 '외상' 항목
        credit: '',

        // 기재 상 '비고' 항목
        remark1: '비고',
        remark2: '비고2',
        remark3: '비고3',

        // 기재 상 '권' 항목, 최대값 32767
        kwon: '',

        // 기재 상 '호' 항목, 최대값 32767
        ho: '',

        // 사업자등록증 이미지 첨부여부
        businessLicenseYN: false,

        // 통장사본 이미지 첨부여부
        bankBookYN: false,


        /************************************************************************
         *                           상세항목(품목) 정보
         **************************************************************************/

        detailList: [
            {
                serialNum: 1,                // 일련번호, 1부터 순차기재
                purchaseDT: '20210801',      // 거래일자, 형식 : yyyyMMdd
                itemName: '품명1',
                spec: '규격',
                qty: '1',                    // 수량, 소수점 2자리까지 기재 가능
                unitCost: '5000',           // 단가, 소수점 2자리까지 기재 가능
                supplyCost: '5000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                tax: '500',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                remark: '비고'
            },
            {
                serialNum: 2,                // 일련번호, 1부터 순차기재
                purchaseDT: '20210801',      // 거래일자, 형식 : yyyyMMdd
                itemName: '품명2',
                spec: '규격',
                qty: '1',                    // 수량, 소수점 2자리까지 기재 가능
                unitCost: '5000',           // 단가, 소수점 2자리까지 기재 가능
                supplyCost: '5000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                tax: '500',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                remark: '비고'
            }
        ],


        /************************************************************************
         *                         수정세금계산서 기재정보
         * - 수정세금계산서를 작성하는 경우에만 값을 기재합니다.
         * - 수정세금계산서 관련 정보는 연동매뉴얼 또는 개발가이드 링크 참조
         * - [참고] 수정세금계산서 작성방법 안내 - https://docs.popbill.com/taxinvoice/modify?lang=node
         **************************************************************************/

        // [수정세금계산서 발행시 필수] 수정사유코드, 수정사유에 따라 1~6 숫자 기재
        modifyCode: '',

        // [수정세금계산서 발행시 필수] 원본세금계산서 국세청승인번호 기재
        orgNTSConfirmNum: '',

        /************************************************************************
         *                             추가담당자 정보
         * - 세금계산서 발행안내 메일을 수신받을 공급받는자 담당자가 다수인 경우
         * 추가 담당자 정보를 등록하여 발행안내메일을 다수에게 전송할 수 있습니다. (최대 5명)
         **************************************************************************/

        // 추가담당자 정보
        addContactList: [
            {
                // 일련번호, 1부터 순차기재
                serialNum: 1,

                // 담당자명
                contactName: '담당자 성명',

                // 담당자 메일
                // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
                // 실제 거래처의 메일주소가 기재되지 않도록 주의
                email: 'test2@test.com'
            },
            {
                // 일련번호, 1부터 순차기재
                serialNum: 2,

                // 담당자명
                contactName: '담당자 성명 2',

                // 담당자 메일
                // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
                // 실제 거래처의 메일주소가 기재되지 않도록 주의
                email: 'test3@test.com'
            }
        ]
    };

    taxinvoiceService.register(testCorpNum, Taxinvoice,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * "임시저장" 상태의 세금계산서를 수정합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#Update
 */
router.get('/update', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 세금계산서 문서번호, 최대 24자리, 영문, 숫자 '-', '_'를 조합하여 사업자별로 중복되지 않도록 구성
    var mgtKey = '20210801-003';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 세금계산서 항목
    var Taxinvoice = {

        // [필수] 작성일자, 날짜형식 yyyyMMdd
        writeDate: '20210801',

        // [필수] 과금방향, (정과금, 역과금) 중 기재, 역과금은 역발행의 경우만 가능
        chargeDirection: '정과금',

        // [필수] 발행형태, (정발행, 역발행, 위수탁) 중 기재
        issueType: '정발행',

        // [필수] (영수, 청구) 중 기재
        purposeType: '영수',

        // [필수] 과세형태, (과세, 영세, 면세) 중 기재
        taxType: '과세',


        /************************************************************************
         *                              공급자 정보
         **************************************************************************/

        // [필수] 공급자 사업자번호, '-' 제외 10자리
        invoicerCorpNum: testCorpNum,

        // [정발행시 필수] 문서번호, 최대 24자리, 영문, 숫자 '-', '_'를 조합하여 사업자별로 중복되지 않도록 구성
        invoicerMgtKey: mgtKey,

        // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
        invoicerTaxRegID: '',

        // [필수] 공급자 상호
        invoicerCorpName: '공급자 상호_수정',

        // [필수] 대표자 성명
        invoicerCEOName: '대표자 성명_수정',

        // 공급자 주소
        invoicerAddr: '공급자 주소',

        // 공급자 종목
        invoicerBizClass: '공급자 업종',

        // 공급자 업태
        invoicerBizType: '공급자 업태',

        // 공급자 담당자명
        invoicerContactName: '공급자 담당자명',

        // 공급자 연락처
        invoicerTEL: '070-4304-2991',

        // 공급자 휴대폰번호
        invoicerHP: '010-000-111',

        // 공급자 메일주소
        invoicerEmail: 'test@test.com',

        // 정발행시 알림문자 전송여부
        // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
        invoicerSMSSendYN: false,


        /************************************************************************
         *                           공급받는자 정보
         **************************************************************************/

        // [필수] 공급받는자 구분, (사업자, 개인, 외국인) 중 기재
        invoiceeType: '사업자',

        // [필수] 공급받는자 사업자번호, '-'제외 10자리
        invoiceeCorpNum: '8888888888',

        // [역발행시 필수] 공급받는자 문서번호
        invoiceeMgtKey: '',

        // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
        invoiceeTaxRegID: '',

        // [필수] 공급받는자 상호
        invoiceeCorpName: '공급받는자 상호',

        // [필수] 공급받는자 대표자 성명
        invoiceeCEOName: '공급받는자 대표자 성명',

        // 공급받는자 주소
        invoiceeAddr: '공급받는자 주소',

        // 공급받는자 종목
        invoiceeBizClass: '공급받는자 종목',

        // 공급받는자 업태
        invoiceeBizType: '공급받는자 업태',

        // 공급받는자 담당자명
        invoiceeContactName1: '공급받는자 담당자명',

        // 공급받는자 연락처
        invoiceeTEL1: '010-111-222',

        // 공급받는자 휴대폰번호
        invoiceeHP1: '070-111-222',

        // 공급받는자 이메일 주소
        // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
        // 실제 거래처의 메일주소가 기재되지 않도록 주의
        invoiceeEmail1: 'test2@test.com',

        // 역발행시 알림문자 전송여부
        // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
        invoiceeSMSSendYN: false,


        /************************************************************************
         *                           세금계산서 기재정보
         **************************************************************************/

        // [필수] 공급가액 합계
        supplyCostTotal: '10000',

        // [필수] 세액합계
        taxTotal: '1000',

        // [필수] 합계금액 (공급가액 합계 + 세액 합계)
        totalAmount: '11000',

        // 기재 상 '일련번호'' 항목
        serialNum: '123',

        // 기재 상 '현금'' 항목
        cash: '',

        // 기재 상 '수표' 항목
        chkBill: '',

        // 기재 상 '어음' 항목
        note: '',

        // 기재 상 '외상' 항목
        credit: '',

        // 기재 상 '비고' 항목
        remark1: '비고',
        remark2: '비고2',
        remark3: '비고3',

        // 기재 상 '권' 항목, 최대값 32767
        kwon: '',

        // 기재 상 '호' 항목, 최대값 32767
        ho: '',

        // 사업자등록증 이미지 첨부여부
        businessLicenseYN: false,

        // 통장사본 이미지 첨부여부
        bankBookYN: false,


        /************************************************************************
         *                           상세항목(품목) 정보
         **************************************************************************/

        detailList: [
            {
                serialNum: 1,                // 일련번호, 1부터 순차기재
                purchaseDT: '20210801',      // 거래일자, 형식 : yyyyMMdd
                itemName: '품명1',
                spec: '규격',
                qty: '1',                    // 수량, 소수점 2자리까지 기재 가능
                unitCost: '5000',           // 단가, 소수점 2자리까지 기재 가능
                supplyCost: '5000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                tax: '500',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                remark: '비고'
            },
            {
                serialNum: 2,                // 일련번호, 1부터 순차기재
                purchaseDT: '20210801',      // 거래일자, 형식 : yyyyMMdd
                itemName: '품명2',
                spec: '규격',
                qty: '1',                    // 수량, 소수점 2자리까지 기재 가능
                unitCost: '5000',           // 단가, 소수점 2자리까지 기재 가능
                supplyCost: '5000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                tax: '500',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                remark: '비고'
            }
        ],


        /************************************************************************
         *                         수정세금계산서 기재정보
         * - 수정세금계산서를 작성하는 경우에만 값을 기재합니다.
         * - 수정세금계산서 관련 정보는 연동매뉴얼 또는 개발가이드 링크 참조
         * - [참고] 수정세금계산서 작성방법 안내 - https://docs.popbill.com/taxinvoice/modify?lang=node
         **************************************************************************/

        // [수정세금계산서 발행시 필수] 수정사유코드, 수정사유에 따라 1~6 숫자 기재
        modifyCode: '',

        // [수정세금계산서 발행시 필수] 원본세금계산서 국세청승인번호 기재
        orgNTSConfirmNum: '',

        /************************************************************************
         *                             추가담당자 정보
         * - 세금계산서 발행안내 메일을 수신받을 공급받는자 담당자가 다수인 경우
         * 추가 담당자 정보를 등록하여 발행안내메일을 다수에게 전송할 수 있습니다. (최대 5명)
         **************************************************************************/

        // 추가담당자 정보
        addContactList: [
            {
                // 일련번호, 1부터 순차기재
                serialNum: 1,

                // 담당자명
                contactName: '담당자 성명',

                // 담당자 메일
                // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
                // 실제 거래처의 메일주소가 기재되지 않도록 주의
                email: 'test2@test.com'
            },
            {
                // 일련번호, 1부터 순차기재
                serialNum: 2,

                // 담당자명
                contactName: '담당자 성명 2',

                // 담당자 메일
                // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
                // 실제 거래처의 메일주소가 기재되지 않도록 주의
                email: 'test3@test.com'
            }
        ]
    };

    taxinvoiceService.update(testCorpNum, keyType, mgtKey, Taxinvoice,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * "임시저장" 또는 "(역)발행대기" 상태의 세금계산서를 발행(전자서명)하며, "발행완료" 상태로 처리합니다.
 *  - 세금계산서 국세청 전송정책 : https://docs.popbill.com/taxinvoice/ntsSendPolicy?lang=node
 * - https://docs.popbill.com/taxinvoice/node/api#TIissue
 */
router.get('/issue', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-033';

    // 메모
    var memo = '발행 테스트';

    // 발행 안내메일 제목, 미기재시 기본제목으로 전송
    var emailSubject = '';

    // 지연발행 강제여부
    // - 지연발행 세금계산서를 발행하는 경우, 가산세가 부과될 수 있습니다.
    var forceIssue = false;

    taxinvoiceService.issue(testCorpNum, keyType, mgtKey, memo, emailSubject, forceIssue, testUserID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message, ntsConfirmNum: result.ntsConfirmNum });
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 국세청 전송 이전 "발행완료" 상태의 세금계산서를 "발행취소"하고 국세청 전송 대상에서 제외합니다.
 * - Delete(삭제)함수를 호출하여 "발행취소" 상태의 전자세금계산서를 삭제하면, 문서번호 재사용이 가능합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#CancelIssue
 */
router.get('/cancelIssue', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-031';

    // 메모
    var memo = '발행취소 메모';

    taxinvoiceService.cancelIssue(testCorpNum, keyType, mgtKey, memo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 공급받는자가 작성한 세금계산서 데이터를 팝빌에 저장하고 공급자에게 송부하여 발행을 요청합니다.
 * - 역발행 세금계산서 프로세스를 구현하기위해서는 공급자/공급받는자가 모두 팝빌에 회원이여야 합니다.
 * - 역발행 즉시요청후 공급자가 [발행] 처리시 포인트가 차감되며 역발행 세금계산서 항목중 과금방향(ChargeDirection)에 기재한 값에 따라 정과금(공급자과금) 또는 역과금(공급받는자과금) 처리됩니다.
 * - https://docs.popbill.com/taxinvoice/node/api#RegistRequest
 */
router.get('/registRequest', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    // 세금계산서 항목
    var Taxinvoice = {

        // [필수] 작성일자, 날짜형식 yyyyMMdd
        writeDate: '20210801',

        // [필수] 과금방향, (정과금, 역과금) 중 기재, 역과금은 역발행의 경우만 가능
        chargeDirection: '정과금',

        // [필수] 발행형태, (정발행, 역발행, 위수탁) 중 기재
        issueType: '역발행',

        // [필수] (영수, 청구) 중 기재
        purposeType: '영수',

        // [필수] 과세형태, (과세, 영세, 면세) 중 기재
        taxType: '과세',


        /************************************************************************
         *                              공급자 정보
         **************************************************************************/

        // [필수] 공급자 사업자번호, '-' 제외 10자리
        invoicerCorpNum: '8888888888',

        // [정발행시 필수] 문서번호, 최대 24자리, 영문, 숫자 '-', '_'를 조합하여 사업자별로 중복되지 않도록 구성
        invoicerMgtKey: '',

        // 공급자 종사업장 식별번호, 필요시 기재, 4자리 숫자
        invoicerTaxRegID: '',

        // [필수] 공급자 상호
        invoicerCorpName: '공급자 상호',

        // [필수] 대표자 성명
        invoicerCEOName: '대표자 성명',

        // 공급자 주소
        invoicerAddr: '공급자 주소',

        // 공급자 종목
        invoicerBizClass: '공급자 업종',

        // 공급자 업태
        invoicerBizType: '공급자 업태',

        // 공급자 담당자명
        invoicerContactName: '공급자 담당자명',

        // 공급자 연락처
        invoicerTEL: '070-4304-2991',

        // 공급자 휴대폰번호
        invoicerHP: '010-000-111',

        // 공급자 메일주소
        invoicerEmail: 'test@test.com',

        // 정발행시 알림문자 전송여부
        // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
        invoicerSMSSendYN: false,


        /************************************************************************
         *                           공급받는자 정보
         **************************************************************************/

        // [필수] 공급받는자 구분, (사업자, 개인, 외국인) 중 기재
        invoiceeType: '사업자',

        // [필수] 공급받는자 사업자번호, '-'제외 10자리
        invoiceeCorpNum: testCorpNum,

        // [역발행시 필수] 공급받는자 문서번호, 최대 24자리, 영문, 숫자 '-', '_'를 조합하여 사업자별로 중복되지 않도록 구성
        invoiceeMgtKey: '20210801-100',

        // 공급받는자 종사업장 식별번호, 필요시 기재, 4자리 숫자
        invoiceeTaxRegID: '',

        // [필수] 공급받는자 상호
        invoiceeCorpName: '공급받는자 상호',

        // [필수] 공급받는자 대표자 성명
        invoiceeCEOName: '공급받는자 대표자 성명',

        // 공급받는자 주소
        invoiceeAddr: '공급받는자 주소',

        // 공급받는자 종목
        invoiceeBizClass: '공급받는자 종목',

        // 공급받는자 업태
        invoiceeBizType: '공급받는자 업태',

        // 공급받는자 담당자명
        invoiceeContactName1: '공급받는자 담당자명',

        // 공급받는자 연락처
        invoiceeTEL1: '010-111-222',

        // 공급받는자 휴대폰번호
        invoiceeHP1: '070-111-222',

        // 공급받는자 이메일 주소
        // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
        // 실제 거래처의 메일주소가 기재되지 않도록 주의
        invoiceeEmail1: 'test2@test.com',

        // 역발행시 알림문자 전송여부
        // - 문자전송지 포인트가 차감되며, 전송실패시 포인트 환불처리됩니다.
        invoiceeSMSSendYN: false,


        /************************************************************************
         *                           세금계산서 기재정보
         **************************************************************************/

        // [필수] 공급가액 합계
        supplyCostTotal: '10000',

        // [필수] 세액합계
        taxTotal: '1000',

        // [필수] 합계금액 (공급가액 합계 + 세액 합계)
        totalAmount: '11000',

        // 기재 상 '일련번호'' 항목
        serialNum: '123',

        // 기재 상 '현금'' 항목
        cash: '',

        // 기재 상 '수표' 항목
        chkBill: '',

        // 기재 상 '어음' 항목
        note: '',

        // 기재 상 '외상' 항목
        credit: '',

        // 기재 상 '비고' 항목
        remark1: '비고',
        remark2: '비고2',
        remark3: '비고3',

        // 기재 상 '권' 항목, 최대값 32767
        kwon: '',

        // 기재 상 '호' 항목, 최대값 32767
        ho: '',

        // 사업자등록증 이미지 첨부여부
        businessLicenseYN: false,

        // 통장사본 이미지 첨부여부
        bankBookYN: false,


        /************************************************************************
         *                           상세항목(품목) 정보
         **************************************************************************/

        detailList: [
            {
                serialNum: 1,                // 일련번호, 1부터 순차기재
                purchaseDT: '20210801',      // 거래일자, 형식 : yyyyMMdd
                itemName: '품명1',
                spec: '규격',
                qty: '1',                    // 수량, 소수점 2자리까지 기재 가능
                unitCost: '5000',           // 단가, 소수점 2자리까지 기재 가능
                supplyCost: '5000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                tax: '500',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                remark: '비고'
            },
            {
                serialNum: 2,                // 일련번호, 1부터 순차기재
                purchaseDT: '20210801',      // 거래일자, 형식 : yyyyMMdd
                itemName: '품명2',
                spec: '규격',
                qty: '1',                    // 수량, 소수점 2자리까지 기재 가능
                unitCost: '5000',           // 단가, 소수점 2자리까지 기재 가능
                supplyCost: '5000',         // 공급가액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                tax: '500',                 // 세액, 소수점 기재불가, 원단위 이하는 절사하여 표현
                remark: '비고'
            }
        ],


        /************************************************************************
         *                         수정세금계산서 기재정보
         * - 수정세금계산서를 작성하는 경우에만 값을 기재합니다.
         * - 수정세금계산서 관련 정보는 연동매뉴얼 또는 개발가이드 링크 참조
         * - [참고] 수정세금계산서 작성방법 안내 - https://docs.popbill.com/taxinvoice/modify?lang=node
         **************************************************************************/

        // [수정세금계산서 발행시 필수] 수정사유코드, 수정사유에 따라 1~6 숫자 기재
        modifyCode: '',

        // [수정세금계산서 발행시 필수] 원본세금계산서 국세청승인번호 기재
        orgNTSConfirmNum: '',

        /************************************************************************
         *                             추가담당자 정보
         * - 세금계산서 발행안내 메일을 수신받을 공급받는자 담당자가 다수인 경우
         * 추가 담당자 정보를 등록하여 발행안내메일을 다수에게 전송할 수 있습니다. (최대 5명)
         **************************************************************************/

    };

    // 메모
    var memo = '즉시요청 메모';

    taxinvoiceService.registRequest(testCorpNum, Taxinvoice, memo, testUserID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 공급받는자가 저장된 역발행 세금계산서를 공급자에게 송부하여 발행 요청합니다.
 * - 역발행 세금계산서 프로세스를 구현하기 위해서는 공급자/공급받는자가 모두 팝빌에 회원이여야 합니다.
 * - 역발행 요청후 공급자가 [발행] 처리시 포인트가 차감되며 역발행 세금계산서 항목중 과금방향(ChargeDirection)에 기재한 값에 따라 정과금(공급자과금) 또는 역과금(공급받는자과금) 처리됩니다.
 * - https://docs.popbill.com/taxinvoice/node/api#Request
 */
router.get('/request', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.BUY;

    // 문서번호
    var mgtKey = '20210801-003';

    // 메모
    var memo = '역발행요청 메모';

    taxinvoiceService.request(testCorpNum, keyType, mgtKey, memo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 공급자가 요청받은 역발행 세금계산서를 발행하기 전, 공급받는자가 역발행요청을 취소합니다.
 * - [취소]한 세금계산서의 문서번호를 재사용하기 위해서는 삭제 (Delete API)를 호출해야 합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#CancelRequest
 */
router.get('/cancelRequest', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.BUY;

    // 문서번호
    var mgtKey = '20210801-003';

    // 메모
    var memo = '역발행요청 취소 메모';

    taxinvoiceService.cancelRequest(testCorpNum, keyType, mgtKey, memo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 공급자가 공급받는자에게 역발행 요청 받은 세금계산서의 발행을 거부합니다.
 * - 세금계산서의 문서번호를 재사용하기 위해서는 삭제 (Delete API)를 호출하여 [삭제] 처리해야 합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#Refuse
 */
router.get('/refuse', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-001';

    // 메모
    var memo = '역발행요청 거부 메모';

    taxinvoiceService.refuse(testCorpNum, keyType, mgtKey, memo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 삭제 가능한 상태의 세금계산서를 삭제합니다.
 * - 삭제 가능한 상태: "임시저장", "발행취소", "역발행거부", "역발행취소", "전송실패"
 * - 세금계산서를 삭제해야만 문서번호(mgtKey)를 재사용할 수 있습니다.
 * - https://docs.popbill.com/taxinvoice/node/api#Delete
 */
router.get('/delete', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-003';

    taxinvoiceService.delete(testCorpNum, keyType, mgtKey,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 공급자가 "발행완료" 상태의 전자세금계산서를 국세청에 즉시 전송하며, 함수 호출 후 최대 30분 이내에 전송 처리가 완료됩니다.
 * - 국세청 즉시전송을 호출하지 않은 세금계산서는 발행일 기준 익일 오후 3시에 팝빌 시스템에서 일괄적으로 국세청으로 전송합니다.
 * - 익일전송시 전송일이 법정공휴일인 경우 다음 영업일에 전송됩니다.
 * - https://docs.popbill.com/taxinvoice/node/api#SendToNTS
 */
router.get('/sendToNTS', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-001';

    taxinvoiceService.sendToNTS(testCorpNum, keyType, mgtKey,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서 1건의 상태 및 요약정보를 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetInfo
 */
router.get('/getInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-003';

    taxinvoiceService.getInfo(testCorpNum, keyType, mgtKey,
        function (result) {
            res.render('Taxinvoice/TaxinvoiceInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 다수건의 세금계산서 상태 및 요약 정보를 확인합니다. (1회 호출 시 최대 1,000건 확인 가능)
 * - https://docs.popbill.com/taxinvoice/node/api#GetInfos
 */
router.get('/getInfos', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호 배열, 최대 1000건
    var mgtKeyList = ['20210801-001', '20210801-003'];

    taxinvoiceService.getInfos(testCorpNum, keyType, mgtKeyList,
        function (result) {
            res.render('Taxinvoice/TaxinvoiceInfos', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서 1건의 상세정보를 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetDetailInfo
 */
router.get('/getDetailInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-003';

    taxinvoiceService.getDetailInfo(testCorpNum, keyType, mgtKey,
        function (result) {
            res.render('Taxinvoice/TaxinvoiceDetail', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 검색조건에 해당하는 세금계산서를 조회합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#Search
 */
router.get('/search', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 검색일자유형, R-등록일시, W-작성일시, I-발행일시
    var DType = 'W';

    // 시작일자, 날짜형식yyyyMMdd)
    var SDate = '20210801';

    // 종료일자, 날짜형식yyyyMMdd)
    var EDate = '20210810';

    // 전송상태값 배열, 문서상태코드 3자리 배열, 와일드카드(*) 사용가능
    var State = ['3**', '6**'];

    // 문서유형, N-일반세금계산서, M-수정세금계산서
    var Type = ['N', 'M'];

    // 과세유형, T-과세, N-면세, Z-영세
    var TaxType = ['T', 'N', 'Z'];

    // 발행형태, N-정발행, R-역발행, T-위수탁
    var IssueType = ['N', 'R', 'T'];

    // 등록형태 배열, P-팝빌 등록, H-홈택스,외부 ASP
    var RegType = ['P', 'H'];

    // 공급받는자 휴폐업조회 상태 배열, N-미확인, 0-미등록, 1-사업중, 2-폐업, 3-휴업
    var CloseDownState = ['N', '0', '1', '2', '3'];

    // 지연발행 여부, null-전체조회, true-지연발행분, false-정상발행분
    var LateOnly = null;

    // 정렬방향, D-내림차순, A-오름차순
    var Order = 'D';

    // 페이지 번호
    var Page = 1;

    // 페이지당 검색개수, 최대 1000건
    var PerPage = 5;

    // 종사업장 사업자 유형, S-공급자, B-공급받는자, T-수탁자
    var TaxRegIDType = 'S';

    // 종사업장 유무, 공백-전체조회, 0-종사업장번호 없음, 1-종사업장번호 있음.
    var TaxRegIDYN = '';

    // 종사업장번호, 콤마(',')로 구분하여 구성 ex) '0001,1234'
    var TaxRegID = '';

    // 거래처 정보, 거래처 상호 또는 사업자등록번호 기재, 미기재시 전체조회
    var QString = '';

    // 전자세금계산서 문서번호 또는 국세청승인번호 기재, 공백 처리시 전체조회
    var MgtKey = '';

    // 연동문서 조회여부, 공백-전체조회, 0-일반문서 조회, 1-연동문서 조회
    var InterOPYN = '';

    taxinvoiceService.search(testCorpNum, keyType, DType, SDate, EDate, State, Type, TaxType,
      LateOnly, Order, Page, PerPage, TaxRegIDType, TaxRegIDYN, TaxRegID, QString, InterOPYN,
      testUserID, IssueType, RegType, CloseDownState, MgtKey,
        function (result) {
            res.render('Taxinvoice/Search', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서의 상태에 대한 변경이력을 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetLogs
 */
router.get('/getLogs', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-01';

    taxinvoiceService.getLogs(testCorpNum, keyType, mgtKey,
        function (result) {
            res.render('Taxinvoice/TaxinvoiceLogs', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 로그인 상태로 팝빌 사이트의 전자세금계산서 문서함 메뉴에 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetURL
 */
router.get('/getURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // TBOX : 임시문서함 , SBOX : 매출문서함 , PBOX : 매입문서함 , WRITE : 매출작성
    var TOGO = 'TBOX';

    taxinvoiceService.getURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 사이트와 동일한 세금계산서 1건의 상세 정보 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetPopUpURL
 */
router.get('/getPopUpURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-001';

    taxinvoiceService.getPopUpURL(testCorpNum, keyType, mgtKey,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 전자세금계산서 보기 팝업 URL을 반환합니다. (버튼/메뉴 제외)
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetViewURL
 */
router.get('/getViewURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-001';

    taxinvoiceService.getViewURL(testCorpNum, keyType, mgtKey,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 전자세금계산서 PDF 파일을 다운 받을 수 있는 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * -  https://docs.popbill.com/taxinvoice/node/api#GetPDFURL
 */
router.get('/getPDFURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-01';

    taxinvoiceService.getPDFURL(testCorpNum, keyType, mgtKey,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 1건의 전자세금계산서를 PDF 파일로 저장하기 위한 데이터를 담은 Buffer를 반환합니다.
 * -  https://docs.popbill.com/taxinvoice/node/api#GetPDF
 */
router.get('/getPDF', function(req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-001';

    var filepath = './Taxinvoice_220210801-001.pdf';

    taxinvoiceService.getPDF(testCorpNum, keyType, mgtKey,
        function (bufPDF) {
            fs.appendFile(filepath, bufPDF, function(err){
                if (err) {
                    res.render('response', {path: req.path, code: '-99999999', message: 'PDF 저장 실패'});
                } else {
                    res.render('response', {path: req.path, code: '1', message: filepath});
                }
            });
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서 1건을 인쇄하기 위한 페이지의 팝업 URL을 반환하며, 페이지내에서 인쇄 설정값을 "공급자" / "공급받는자" / "공급자+공급받는자"용 중 하나로 지정할 수 있습니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetPrintURL
 */
router.get('/getPrintURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-001';

    taxinvoiceService.getPrintURL(testCorpNum, keyType, mgtKey,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서 1건을 구버전 양식으로 인쇄하기 위한 페이지의 팝업 URL을 반환하며, 페이지내에서 인쇄 설정값을 "공급자" / "공급받는자" / "공급자+공급받는자"용 중 하나로 지정할 수 있습니다..
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetOldPrintURL
 */
router.get('/getOldPrintURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-000004';

    taxinvoiceService.getOldPrintURL(testCorpNum, keyType, mgtKey,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * "공급받는자" 용 세금계산서 1건을 인쇄하기 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetEPrintURL
 */
router.get('/getEPrintURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-001';

    taxinvoiceService.getEPrintURL(testCorpNum, keyType, mgtKey,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 다수건의 세금계산서를 인쇄하기 위한 페이지의 팝업 URL을 반환합니다. (최대 100건)
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetMassPrintURL
 */
router.get('/getMassPrintURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호열 배열, 최대 100건
    var mgtKeyList = ['20210801-001', '20210801-002', '20210801-003'];

    taxinvoiceService.getMassPrintURL(testCorpNum, keyType, mgtKeyList,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 안내메일과 관련된 전자세금계산서를 확인 할 수 있는 상세 페이지의 팝업 URL을 반환하며, 해당 URL은 메일 하단의 "전자세금계산서 보기" 버튼의 링크와 같습니다.
 * - 함수 호출로 반환 받은 URL에는 유효시간이 없습니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetMailURL
 */
router.get('/getMailURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-001';

    taxinvoiceService.getMailURL(testCorpNum, keyType, mgtKey,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 사이트에 로그인 상태로 접근할 수 있는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetAccessURL
 */
router.get('/getAccessURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    taxinvoiceService.getAccessURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서에 첨부할 인감, 사업자등록증, 통장사본을 등록하는 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetSealURL
 */
router.get('/getSealURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    taxinvoiceService.getSealURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * "임시저장" 상태의 세금계산서에 1개의 파일을 첨부합니다. (최대 5개)
 * - https://docs.popbill.com/taxinvoice/node/api#AttachFile
 */
router.get('/attachFile', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-003';

    // 파일경로
    var FilePaths = ['./test.jpg'];

    // 파일명
    var fileName = FilePaths[0].replace(/^.*[\\\/]/, '');

    taxinvoiceService.attachFile(testCorpNum, keyType, mgtKey, fileName, FilePaths,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * "임시저장" 상태의 세금계산서에 첨부된 1개의 파일을 삭제합니다.
 * - 파일을 식별하는 파일아이디는 첨부파일 목록(GetFiles API) 의 응답항목 중 파일아이디(AttachedFile) 값을 통해 확인할 수 있습니다.
 * - https://docs.popbill.com/taxinvoice/node/api#DeleteFile
 */
router.get('/deleteFile', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-003';

    // 삭제할 파일아이디, getFiles API의 attachedFile 변수값으로 확인
    var fileID = '06B1E04E-29EC-451B-8AF7-BA717072DAAB.PBF';

    taxinvoiceService.deleteFile(testCorpNum, keyType, mgtKey, fileID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서에 첨부된 파일목록을 확인합니다.
 * - 응답항목 중 파일아이디(AttachedFile) 항목은 파일삭제(DeleteFile API) 호출시 이용할 수 있습니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetFiles
 */
router.get('/getFiles', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-003';

    taxinvoiceService.getFiles(testCorpNum, keyType, mgtKey,
        function (result) {
            res.render('Taxinvoice/AttachedFile', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서와 관련된 안내 메일을 재전송 합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#SendEmail
 */
router.get('/sendEmail', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-001';

    // 수신 메일주소
    // 팝빌 개발환경에서 테스트하는 경우에도 안내 메일이 전송되므로,
    // 실제 거래처의 메일주소가 기재되지 않도록 주의
    var receiver = 'test@test.com';

    taxinvoiceService.sendEmail(testCorpNum, keyType, mgtKey, receiver,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서와 관련된 안내 SMS(단문) 문자를 재전송하는 함수로, 팝빌 사이트 [문자·팩스] > [문자] > [전송내역] 메뉴에서 전송결과를 확인 할 수 있습니다.
 * - 메시지는 최대 90byte까지 입력 가능하고, 초과한 내용은 자동으로 삭제되어 전송합니다. (한글 최대 45자)
 * - 함수 호출시 포인트가 과금됩니다.
 * - https://docs.popbill.com/taxinvoice/node/api#SendSMS
 */
router.get('/sendSMS', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-001';

    // 발신번호
    var senderNum = '07043042991';

    // 수신번호
    var receiverNum = '010111222';

    // 메세지 내용, 90byte 초과시 길이가 조정되어 전송됨
    var contents = '팝빌 전자세금계산서 문자전송';

    taxinvoiceService.sendSMS(testCorpNum, keyType, mgtKey, senderNum, receiverNum, contents,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서를 팩스로 전송하는 함수로, 팝빌 사이트 [문자·팩스] > [팩스] > [전송내역] 메뉴에서 전송결과를 확인 할 수 있습니다.
 * - 함수 호출시 포인트가 과금됩니다.
 * - https://docs.popbill.com/taxinvoice/node/api#SendFAX
 */
router.get('/sendFAX', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-001';

    // 발신번호
    var senderNum = '07043042991';

    // 수신팩스번호
    var receiverNum = '000111222';

    taxinvoiceService.sendFAX(testCorpNum, keyType, mgtKey, senderNum, receiverNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 전자명세서 API를 통해 발행한 전자명세서를 세금계산서에 첨부합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#AttachStatement
 */
router.get('/attachStatement', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-003';

    // 첨부할 전자명세서 종류코드, 121-거래명세서, 122-청구서, 123-발주서, 124-견적서, 125-입금표, 126-영수증
    var subItemCode = 121;

    // 첨부할 전자명세서 문서번호
    var subMgtKey = '20210801-001';

    taxinvoiceService.attachStatement(testCorpNum, keyType, mgtKey, subItemCode, subMgtKey,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서에 첨부된 전자명세서를 해제합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#DetachStatement
 */
router.get('/detachStatement', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 문서번호
    var mgtKey = '20210801-003';

    // 첨부해제할 전자명세서 종류코드, 121-거래명세서, 122-청구서, 123-발주서, 124-견적서, 125-입금표, 126-영수증
    var subItemCode = 121;

    // 첨부해제할 전자명세서 문서번호
    var subMgtKey = '20210801-S001';

    taxinvoiceService.detachStatement(testCorpNum, keyType, mgtKey, subItemCode, subMgtKey,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 전자세금계산서 유통사업자의 메일 목록을 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetEmailPublicKeys
 */
router.get('/getEmailPublicKeys', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    taxinvoiceService.getEmailPublicKeys(testCorpNum,
        function (result) {
            res.render('Taxinvoice/EmailPublicKeys', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 사이트를 통해 발행하였지만 문서번호가 존재하지 않는 세금계산서에 문서번호를 할당합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#AssignMgtKey
 */
router.get('/assignMgtKey', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 발행유형, SELL:매출, BUY:매입, TRUSTEE:위수탁
    var keyType = popbill.MgtKeyType.SELL;

    // 세금계산서 팝빌번호, 문서 목록조회(Search) API의 반환항목중 ItemKey 참조
    var itemKey = '021111509343200001';

    // 할당할 문서번호, 최대 24자리, 영문, 숫자 '-', '_'를 조합하여 사업자별로 중복되지 않도록 구성
    var mgtKey = '20210801-001';

    taxinvoiceService.assignMgtKey(testCorpNum, keyType, itemKey, mgtKey,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서 관련 메일 항목에 대한 발송설정을 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#ListEmailConfig
 */
router.get('/listEmailConfig', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    taxinvoiceService.listEmailConfig(testCorpNum,
        function (result) {
            res.render('Taxinvoice/ListEmailConfig', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 세금계산서 관련 메일 항목에 대한 발송설정을 수정합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#UpdateEmailConfig
 * 메일전송유형
 * [정발행]
 * TAX_ISSUE : 공급받는자에게 전자세금계산서가 발행 되었음을 알려주는 메일입니다.
 * TAX_ISSUE_INVOICER : 공급자에게 전자세금계산서가 발행 되었음을 알려주는 메일입니다.
 * TAX_CHECK : 공급자에게 전자세금계산서가 수신확인 되었음을 알려주는 메일입니다.
 * TAX_CANCEL_ISSUE : 공급받는자에게 전자세금계산서가 발행취소 되었음을 알려주는 메일입니다.
 *
 * [발행예정]
 * TAX_SEND : 공급받는자에게 [발행예정] 세금계산서가 발송 되었음을 알려주는 메일입니다.
 * TAX_ACCEPT : 공급자에게 [발행예정] 세금계산서가 승인 되었음을 알려주는 메일입니다.
 * TAX_ACCEPT_ISSUE : 공급자에게 [발행예정] 세금계산서가 자동발행 되었음을 알려주는 메일입니다.
 * TAX_DENY : 공급자에게 [발행예정] 세금계산서가 거부 되었음을 알려주는 메일입니다.
 * TAX_CANCEL_SEND : 공급받는자에게 [발행예정] 세금계산서가 취소 되었음을 알려주는 메일입니다.
 *
 * [역발행]
 * TAX_REQUEST : 공급자에게 세금계산서를 전자서명 하여 발행을 요청하는 메일입니다.
 * TAX_CANCEL_REQUEST : 공급받는자에게 세금계산서가 취소 되었음을 알려주는 메일입니다.
 * TAX_REFUSE : 공급받는자에게 세금계산서가 거부 되었음을 알려주는 메일입니다.
 *
 * [위수탁발행]
 * TAX_TRUST_ISSUE : 공급받는자에게 전자세금계산서가 발행 되었음을 알려주는 메일입니다.
 * TAX_TRUST_ISSUE_TRUSTEE : 수탁자에게 전자세금계산서가 발행 되었음을 알려주는 메일입니다.
 * TAX_TRUST_ISSUE_INVOICER : 공급자에게 전자세금계산서가 발행 되었음을 알려주는 메일입니다.
 * TAX_TRUST_CANCEL_ISSUE : 공급받는자에게 전자세금계산서가 발행취소 되었음을 알려주는 메일입니다.
 * TAX_TRUST_CANCEL_ISSUE_INVOICER : 공급자에게 전자세금계산서가 발행취소 되었음을 알려주는 메일입니다.
 *
 * [위수탁 발행예정]
 * TAX_TRUST_SEND : 공급받는자에게 [발행예정] 세금계산서가 발송 되었음을 알려주는 메일입니다.
 * TAX_TRUST_ACCEPT : 수탁자에게 [발행예정] 세금계산서가 승인 되었음을 알려주는 메일입니다.
 * TAX_TRUST_ACCEPT_ISSUE : 수탁자에게 [발행예정] 세금계산서가 자동발행 되었음을 알려주는 메일입니다.
 * TAX_TRUST_DENY : 수탁자에게 [발행예정] 세금계산서가 거부 되었음을 알려주는 메일입니다.
 * TAX_TRUST_CANCEL_SEND : 공급받는자에게 [발행예정] 세금계산서가 취소 되었음을 알려주는 메일입니다.
 *
 * [처리결과]
 * TAX_CLOSEDOWN : 거래처의 휴폐업 여부를 확인하여 안내하는 메일입니다.
 * TAX_NTSFAIL_INVOICER : 전자세금계산서 국세청 전송실패를 안내하는 메일입니다.
 *
 * [정기발송]
 * TAX_SEND_INFO : 전월 귀속분 [매출 발행 대기] 세금계산서의 발행을 안내하는 메일입니다.
 * ETC_CERT_EXPIRATION : 팝빌에서 이용중인 공인인증서의 갱신을 안내하는 메일입니다.
 */
router.get('/updateEmailConfig', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 메일 전송 유형
    var emailType = 'TAX_ISSUE';

    // 전송 여부 (true = 전송, false = 미전송)
    var sendYN = true;

    taxinvoiceService.updateEmailConfig(testCorpNum, emailType, sendYN,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 국세청 전송 옵션 설정 상태를 확인합니다.
 * - 국세청 전송 옵션 설정은 팝빌 사이트 [전자세금계산서] > [환경설정] > [세금계산서 관리] 메뉴에서 설정할 수 있으며, API로 설정은 불가능 합니다.
 * - https://docs.popbill.com/taxinvoice/dotnet/api#GetSendToNTSConfig
 */
router.get('/getSendToNTSConfig', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';
    taxinvoiceService.getSendToNTSConfig(testCorpNum,
        function (result) {
            res.render('Taxinvoice/SendToNTSConfig', {path: req.path, sendToNTSConfig: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 전자세금계산서 발행에 필요한 인증서를 팝빌 인증서버에 등록하기 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - 인증서 갱신/재발급/비밀번호 변경한 경우, 변경된 인증서를 팝빌 인증서버에 재등록 해야합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetTaxCertURL
 */
router.get('/getTaxCertURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    taxinvoiceService.getTaxCertURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 인증서버에 등록된 인증서의 만료일을 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetCertificateExpireDate
 */
router.get('/getCertificateExpireDate', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    taxinvoiceService.getCertificateExpireDate(testCorpNum,
        function (expireDate) {
            res.render('result', {path: req.path, result: expireDate});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 인증서버에 등록된 인증서의 유효성을 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#CheckCertValidation
 */
router.get('/checkCertValidation', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    taxinvoiceService.checkCertValidation(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 잔여포인트를 확인합니다.
 * - 과금방식이 파트너과금인 경우 파트너 잔여포인트(GetPartnerBalance API)를 통해 확인하시기 바랍니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetBalance
 */
router.get('/getBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    taxinvoiceService.getBalance(testCorpNum,
        function (remainPoint) {
            res.render('result', {path: req.path, result: remainPoint})
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetChargeURL
 */
router.get('/getChargeURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // 팝빌회원 아이디
    var testUserID = 'testkorea';

    taxinvoiceService.getChargeURL(testCorpNum, testUserID,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너의 잔여포인트를 확인합니다.
 * - 과금방식이 연동과금인 경우 연동회원 잔여포인트(GetBalance API)를 이용하시기 바랍니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetPartnerBalance
 */
router.get('/getPartnerBalance', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    taxinvoiceService.getPartnerBalance(testCorpNum,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 파트너 포인트 충전을 위한 페이지의 팝업 URL을 반환합니다.
 * - 반환되는 URL은 보안 정책상 30초 동안 유효하며, 시간을 초과한 후에는 해당 URL을 통한 페이지 접근이 불가합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetPartnerURL
 */
router.get('/getPartnerURL', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    // CHRG(포인트충전)
    var TOGO = 'CHRG';

    taxinvoiceService.getPartnerURL(testCorpNum, TOGO,
        function (url) {
            res.render('result', {path: req.path, result: url});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 전자세금계산서 발행단가를 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetUnitCost
 */
router.get('/getUnitCost', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '';

    taxinvoiceService.getUnitCost(testCorpNum,
        function (unitCost) {
            res.render('result', {path: req.path, result: unitCost});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 팝빌 전자세금계산서 API 서비스 과금정보를 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetChargeInfo
 */
router.get('/getChargeInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    taxinvoiceService.getChargeInfo(testCorpNum,
        function (result) {
            res.render('Base/getChargeInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사업자번호를 조회하여 연동회원 가입여부를 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#CheckIsMember
 */
router.get('/checkIsMember', function (req, res, next) {

    // 조회할 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    taxinvoiceService.checkIsMember(testCorpNum,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사용하고자 하는 아이디의 중복여부를 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#CheckID
 */
router.get('/checkID', function (req, res, next) {

    // 조회할 아이디
    var testID = 'testkorea';

    taxinvoiceService.checkID(testID,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 사용자를 연동회원으로 가입처리합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#JoinMember
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

    taxinvoiceService.joinMember(joinInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#GetCorpInfo
 */
router.get('/getCorpInfo', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '1234567890';

    taxinvoiceService.getCorpInfo(testCorpNum,
        function (result) {
            res.render('Base/getCorpInfo', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원의 회사정보를 수정합니다
 * - https://docs.popbill.com/taxinvoice/node/api#UpdateCorpInfo
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

    taxinvoiceService.updateCorpInfo(testCorpNum, corpInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 담당자(팝빌 로그인 계정)를 추가합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#RegistContact
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

    taxinvoiceService.registContact(testCorpNum, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 정보를 수정합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#UpdateContact
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

    taxinvoiceService.updateContact(testCorpNum, testUserID, contactInfo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});

/*
 * 연동회원 사업자번호에 등록된 담당자(팝빌 로그인 계정) 목록을 확인합니다.
 * - https://docs.popbill.com/taxinvoice/node/api#ListContact
 */
router.get('/listContact', function (req, res, next) {

    // 팝빌회원 사업자번호
    var testCorpNum = '1234567890';

    taxinvoiceService.listContact(testCorpNum,
        function (result) {
            res.render('Base/listContact', {path: req.path, result: result});
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});


module.exports = router;
