import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Assets, colors, Flex, ListHeader, ListRow, NavigationBar, TextFieldLine, Top } from 'ishopcare-lib';
import { searchAddresses } from '../api';
import { Address } from '../models';
import { contractSession } from '../utils/contractSession';

export function AddressPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);

  const handleSearch = async () => {
    if (!search) return;
    try {
      const result = await searchAddresses(search);
      setAddresses(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelect = (address: Address) => {
    const { merchant } = contractSession.load();
    contractSession.save({
      merchant: {
        name: merchant?.name || '',
        businessNumber: merchant?.businessNumber || '',
        address: {
          ...merchant?.address,
          street: address.street,
          city: address.city,
          state: address.state,
          zipcode: address.zipcode,
          details: '',
        },
      },
    });
    navigate('/merchant-info');
  };

  return (
    <>
      <NavigationBar
        left={
          <Assets.Icon name="icon-arrow-left-mono" shape={{ width: 32, height: 32 }} onClick={() => navigate(-1)} />
        }
      />
      <Top title={<Top.TitleParagraph>주소 검색하기</Top.TitleParagraph>} />
      <Flex direction="column" css={{ padding: '0 24px', gap: 20 }}>
        <TextFieldLine
          placeholder="주소"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
      </Flex>
      {addresses.length > 0 && (
        <>
          <ListHeader
            title={
              <ListHeader.TitleParagraph fontWeight="bold" color={colors.grey600}>
                {search} 검색 결과
              </ListHeader.TitleParagraph>
            }
          />
          <Flex direction="column">
            {addresses.map((address, index) => (
              <ListRow
                key={index}
                onClick={() => handleSelect(address)}
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top={`${address.city} ${address.state} ${address.street}`}
                    topProps={{ color: colors.grey800, fontWeight: 'semibold' }}
                    bottom={address.zipcode}
                    bottomProps={{ color: colors.grey500, fontWeight: 'medium' }}
                  />
                }
              />
            ))}
          </Flex>
        </>
      )}
    </>
  );
}
