import { Assets, Flex, NavigationBar, Spacing, TextFieldLine, Toast, Top } from 'ishopcare-lib';
import { FormCTA } from '../components/FormCTA';
import { useNavigate } from 'react-router';
import { overlay } from 'overlay-kit';
import { contractSession } from '../utils/contractSession';
import { useForm } from '../hooks/useForm';
import { ErrorText } from '../components/ErrorText';
import { validateMerchant } from '../api';

const validate = (values: { storeName: string; businessNumber: string; address: string; addressDetail: string }) => {
  const errors: Record<string, string> = {};

  if (!values.storeName.trim()) {
    errors.storeName = '상호명을 입력해주세요.';
  }

  if (!values.businessNumber) {
    errors.businessNumber = '사업자등록번호를 입력해주세요.';
  } else if (!/^\d+$/.test(values.businessNumber)) {
    errors.businessNumber = '숫자만 입력해주세요.';
  }

  if (!values.address) {
    errors.address = '주소를 입력해주세요.';
  }
  if (!values.addressDetail) {
    errors.address = '상세주소를 입력해주세요.';
  }

  return errors;
};

export function MerchantInfoPage() {
  const navigate = useNavigate();
  const { basic, merchant } = contractSession.load();

  const { values, errors, touched, handleChange, isValid } = useForm(
    {
      storeName: merchant?.name || '',
      businessNumber: merchant?.businessNumber || '',
      address: merchant?.address?.street || '',
      addressDetail: merchant?.address?.details || '',
    },
    validate
  );

  const onClickSearchAddress = () => {
    // 주소 검색 전 입력값 저장
    contractSession.save({
      merchant: {
        name: values.storeName,
        businessNumber: values.businessNumber,
        address: merchant?.address || {
          street: '',
          city: '',
          state: '',
          zipcode: '',
          details: '',
        },
      },
    });
    navigate('/address');
  };

  const onClickNext = async () => {
    if (!isValid) return;

    // 기가맹 업체 여부 체크
    try {
      await validateMerchant({
        name: values.storeName,
        businessNumber: values.businessNumber,
        address: {
          street: values.address,
          city: merchant?.address?.city || '',
          state: merchant?.address?.state || '',
          zipcode: merchant?.address?.zipcode || '',
        },
      });
    } catch (e) {
      overlay.open(({ isOpen, close }) => {
        return <Toast isOpen={isOpen} close={close} type="warn" message="이미 계약된 매장이에요" delay={1500} />;
      });
      return;
    }

    contractSession.save({
      merchant: {
        ...merchant,
        name: values.storeName,
        businessNumber: values.businessNumber,
        address: {
          ...merchant?.address,
          street: values.address,
          details: values.addressDetail,
          city: merchant?.address?.city || '',
          state: merchant?.address?.state || '',
          zipcode: merchant?.address?.zipcode || '',
        },
      },
    });

    navigate('/business-info');
  };

  return (
    <>
      <NavigationBar left={<Assets.Icon name="icon-arrow-left-mono" shape={{ width: 32, height: 32 }} />} />
      <Top
        title={<Top.TitleParagraph>매장 정보를 입력주세요</Top.TitleParagraph>}
        subtitle={<Top.SubTitleParagraph>{basic?.name}님의 매장 정보가 필요해요.</Top.SubTitleParagraph>}
      />
      <Spacing size={20} />
      <Flex direction="column" css={{ padding: '0 24px', gap: 20 }}>
        <div>
          <TextFieldLine
            placeholder="상호명"
            value={values.storeName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('storeName', e.target.value)}
          />
          {touched.storeName && errors.storeName && <ErrorText message={errors.storeName} />}
        </div>

        <div>
          <TextFieldLine
            placeholder="사업자등록번호"
            value={values.businessNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('businessNumber', e.target.value)}
            type="tel"
          />
          {touched.businessNumber && errors.businessNumber && <ErrorText message={errors.businessNumber} />}
        </div>

        <div>
          <TextFieldLine
            placeholder="주소"
            value={values.address}
            readOnly={true}
            onClick={() => {
              onClickSearchAddress();
            }}
          />
          {touched.address && errors.address && <ErrorText message={errors.address} />}
        </div>

        <div>
          <TextFieldLine
            placeholder="상세주소"
            value={values.addressDetail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('addressDetail', e.target.value)}
          />
          {touched.addressDetail && errors.addressDetail && <ErrorText message={errors.addressDetail} />}
        </div>
      </Flex>
      <FormCTA isValid={isValid} onClick={onClickNext}>
        다음
      </FormCTA>
    </>
  );
}
