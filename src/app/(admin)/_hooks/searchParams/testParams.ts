import { atom } from 'recoil';

export const testParams = atom({
  key: 'testState',
  default: {
    test1: "",
    test2: "",
    test3: "",
  },
});
