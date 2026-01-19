import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Assets, Checkbox, colors, Flex, ListRow, NavigationBar, Spacing, Toast, Top } from 'ishopcare-lib';
import { overlay } from 'overlay-kit';
import { FormCTA } from '../components/FormCTA';
import { createContract, getBusinessCategories } from '../api';
import { BusinessCategory } from '../models';
import { contractSession } from '../utils/contractSession';
import { isContract } from '../utils/typeGuard';

export function BusinessInfoPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { basic, merchant } = contractSession.load();
  useEffect(() => {
    if (!basic?.name || !merchant?.name) {
      navigate('/');
      return;
    }
    getBusinessCategories().then(setCategories);
  }, [basic, merchant, navigate]);

  const handleSelect = (value: string) => {
    setSelectedCategory(value === selectedCategory ? null : value);
  };

  const isValid = !!selectedCategory;

  const onClickSubmit = async () => {
    if (isValid) {
      contractSession.save({
        businessCategory: selectedCategory!,
      });

      const contractData = contractSession.load();
      // 데이터 무결성 체크
      if (!isContract(contractData)) {
        overlay.open(({ isOpen, close }) => {
          return <Toast isOpen={isOpen} close={close} type="warn" message="필수 정보가 누락되었어요." />;
        });
        return;
      }

      try {
        await createContract(contractData);
        navigate('/complete');
      } catch (e) {
        overlay.open(({ isOpen, close }) => {
          return <Toast isOpen={isOpen} close={close} type="warn" message="저장에 실패했어요. 다시 시도해주세요." />;
        });
      }
    }
  };

  return (
    <>
      <NavigationBar left={<Assets.Icon name="icon-arrow-left-mono" shape={{ width: 32, height: 32 }} />} />
      <Top
        title={<Top.TitleParagraph>{merchant?.name} 매장의 업종을 알려주세요</Top.TitleParagraph>}
        subtitle={<Top.SubTitleParagraph>업종에 따라 제출해야할 서류가 달라요.</Top.SubTitleParagraph>}
      />
      <Spacing size={20} />
      <Flex direction="column">
        {categories.map(category => (
          <ListRow
            key={category.value}
            contents={<ListRow.Texts type="1RowTypeA" top={category.name} topProps={{ color: colors.grey700 }} />}
            right={<Checkbox.Line checked={selectedCategory === category.value} size={20} />}
            onClick={() => handleSelect(category.value)}
          />
        ))}
      </Flex>
      <FormCTA isValid={isValid} onClick={() => onClickSubmit()}>
        제출하기
      </FormCTA>
    </>
  );
}
