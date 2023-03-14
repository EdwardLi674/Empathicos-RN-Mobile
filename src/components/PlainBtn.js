import React, {useEffect, useRef} from 'react';
import {Button} from 'native-base';

export const PlainBtn = props => {
  const {loading, isDisable, onPress, btnLabel} = props;
  return (
    <Button
      bg="#143c6e"
      px="4"
      py="0.3"
      borderRadius="4"
      borderColor="amber.300"
      borderWidth="1"
      isLoading={loading}
      isLoadingText="Saving"
      _text={{
        fontSize: 18,
        fontFamily: 'CenturyGothic',
        fontWeight: 600,
      }}
      isDisabled={isDisable}
      onPress={onPress}>
      {btnLabel}
    </Button>
  );
};
