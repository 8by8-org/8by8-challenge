import { Meta, StoryObj } from '@storybook/react';
import { StateInformationModal } from '@/app/register/eligibility/state-information-modal';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof StateInformationModal> = {
  component: StateInformationModal,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof StateInformationModal>;

export const NorthDakota: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <StateInformationModal
          stateAbbr="ND"
          showModal
          setShowModal={() => {}}
          parentFormId=""
          parentFormName=""
        />
      </GlobalStylesProvider>
    );
  },
};

export const NewHampshire: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <StateInformationModal
          stateAbbr="NH"
          showModal
          setShowModal={() => {}}
          parentFormId=""
          parentFormName=""
        />
      </GlobalStylesProvider>
    );
  },
};

export const Wyoming: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <StateInformationModal
          stateAbbr="WY"
          showModal
          setShowModal={() => {}}
          parentFormId=""
          parentFormName=""
        />
      </GlobalStylesProvider>
    );
  },
};
