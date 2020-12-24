import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { COLORS } from '../../common/styles/CMTheme';
import Card, { CardProps } from '../../components/Card';
import MythCard from '../../components/MythCard';
import Wrapper from '../../components/Wrapper';

const myth = {
  id: '1',
  myth: 'Global warming stopped in 1998.',
  fact:
    'Our planet has continued to build up heat since 1998 - global warming is still happening',
};

export default {
  title: 'ClimateMind/components/MythCard',
  component: MythCard,
  decorators: [
    (Story) => (
      <Wrapper bgColor={COLORS.SECONDARY} fullHeight>
        <Story />
      </Wrapper>
    ),
  ],
} as Meta;

const Template: Story<CardProps> = (args) => <MythCard myth={myth} {...args} />;

export const DefaultCard = Template.bind({});
DefaultCard.args = {
  bgColor: COLORS.SUCCESS_LIGHT,
};
