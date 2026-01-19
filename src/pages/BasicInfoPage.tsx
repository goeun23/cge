import { Assets, Flex, NavigationBar, TextFieldLine, Top, Spacing } from 'ishopcare-lib';
import { FormCTA } from '../components/FormCTA';
import { useNavigate } from 'react-router';
import { useForm } from '../hooks/useForm';
import { contractSession } from '../utils/contractSession';
import { ErrorText } from '../components/ErrorText';

const validate = (values: { name: string; phone: string; email: string }) => {
  const errors: Record<string, string> = {};

  if (!values.name.trim()) {
    errors.name = '이름을 입력해주세요.';
  }

  if (!values.phone) {
    errors.phone = '휴대폰 번호를 입력해주세요.';
  } else if (!/^\d+$/.test(values.phone)) {
    errors.phone = '숫자만 입력해주세요.';
  }

  if (!values.email) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.';
  }
  return errors;
};

export function BasicInfoPage() {
  const navigate = useNavigate();

  const { values, errors, touched, handleChange, isValid } = useForm(
    {
      name: '',
      phone: '',
      email: '',
    },
    validate
  );

  const onClickNext = () => {
    if (!isValid) return;

    contractSession.save({
      basic: {
        name: values.name,
        phone: values.phone,
        email: values.email,
      },
    });
    navigate('/merchant-info');
  };

  return (
    <>
      <NavigationBar left={<Assets.Icon name="icon-arrow-left-mono" shape={{ width: 32, height: 32 }} />} />
      <Top
        title={<Top.TitleParagraph>대표자 정보를 입력해주세요</Top.TitleParagraph>}
        subtitle={<Top.SubTitleParagraph>사업자등록증 상의 대표자 정보를 입력해야 해요.</Top.SubTitleParagraph>}
      />
      <Spacing size={20} />
      <Flex direction="column" css={{ padding: '0 24px', gap: 20 }}>
        <div>
          <TextFieldLine
            placeholder="이름"
            value={values.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
          />
          {touched.name && errors.name && <ErrorText message={errors.name} />}
        </div>

        <div>
          <TextFieldLine
            placeholder="휴대폰 번호"
            value={values.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phone', e.target.value)}
            type="tel"
          />

          {touched.phone && errors.phone && <ErrorText message={errors.phone} />}
        </div>

        <div>
          <TextFieldLine
            placeholder="이메일"
            value={values.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
            type="email"
          />
          {touched.email && errors.email && <ErrorText message={errors.email} />}
        </div>
      </Flex>
      <FormCTA isValid={isValid} onClick={onClickNext}>
        다음
      </FormCTA>
    </>
  );
}
