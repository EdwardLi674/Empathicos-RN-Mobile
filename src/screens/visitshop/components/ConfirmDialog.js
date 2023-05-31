import React, {useRef} from 'react';
import {AlertDialog, Button, Text} from 'native-base';

export const ConfirmDialog = props => {
  const {isOpen, onClosed} = props;
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={() => onClosed('cancel')}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>
          <Text fontFamily="CenturyGothic" fontSize="18" color="black">
            Delete
          </Text>
        </AlertDialog.Header>
        <AlertDialog.Body>
          <Text fontSize="16" fontFamily="CenturyGothic">
            Are you sure to remove the current item from your cart?
          </Text>
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button
              variant="unstyled"
              colorScheme="coolGray"
              onPress={() => onClosed('cancel')}
              ref={cancelRef}
              _text={{fontSize: 14, fontFamily: 'CenturyGothic'}}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onPress={() => onClosed('ok')}
              _text={{fontSize: 14, fontFamily: 'CenturyGothic'}}
              px="4">
              Ok
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};
