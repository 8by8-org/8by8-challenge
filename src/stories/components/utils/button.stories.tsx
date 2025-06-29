import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../../components/utils/button';
import { GlobalStylesProvider } from '../../global-styles-provider';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const GradientLarge: Story = {
  render: () => (
    <GlobalStylesProvider>
      <Button variant="gradient" size="lg">
        Gradient Button
      </Button>
    </GlobalStylesProvider>
  ),
};

export const InvertedSmall: Story = {
  render: () => (
    <GlobalStylesProvider>
      <Button variant="inverted" size="sm">
        Inverted Button
      </Button>
    </GlobalStylesProvider>
  ),
};

export const WideGradientLarge: Story = {
  render: () => (
    <GlobalStylesProvider>
      <Button variant="gradient" size="lg" wide>
        Wide Gradient Button
      </Button>
    </GlobalStylesProvider>
  ),
};

export const GradientSmall: Story = {
  render: () => (
    <GlobalStylesProvider>
      <Button variant="gradient" size="sm">
        Gradient Button
      </Button>
    </GlobalStylesProvider>
  ),
};

export const InvertedLarge: Story = {
  render: () => (
    <GlobalStylesProvider>
      <Button variant="inverted" size="lg">
        Inverted Button
      </Button>
    </GlobalStylesProvider>
  ),
};

export const WideInvertedSmall: Story = {
  render: () => (
    <GlobalStylesProvider>
      <Button variant="inverted" size="sm" wide>
        Wide Inverted Button
      </Button>
    </GlobalStylesProvider>
  ),
};

export const DoubleButtons: Story = {
  render: () => (
    <GlobalStylesProvider>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'blue',
          padding: 18,
        }}
      >
        <Button variant="inverted" size="sm">
          Button
        </Button>
        <Button variant="inverted" size="sm">
          Button
        </Button>
      </div>
    </GlobalStylesProvider>
  ),
};
