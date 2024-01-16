import React, { useContext, useCallback } from 'react';
import { ThemeContext, useLocalize } from '~/hooks';
import { Switch } from '~/components/ui';
import { Root, Anchor } from '@radix-ui/react-popover';
import { useSetIndexOptions } from '~/hooks';

export default function ThemeOptions() {
  const { theme, setTheme } = useContext(ThemeContext);
  const localize = useLocalize();
  const { setOption } = useSetIndexOptions();

  const changeTheme = useCallback(
    () => {
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    },
    [setTheme],
  );

  const ThemeSelector = () => {
    return (
      <div className="flex items-center justify-between gap-2">
        <div> {localize('com_nav_theme')} </div>
        <Switch
          checked={theme === 'light'}
          onCheckedChange={changeTheme}
        />
      </div>
    );
  };

  return (
    <Root>
      <Anchor>
        <div className="my-auto lg:max-w-2xl xl:max-w-3xl">
          <span className="flex w-full flex-col items-center justify-center gap-0 md:order-none md:m-auto md:gap-2">
            <div className="z-[61] flex w-full items-center justify-center gap-2">
              <ThemeSelector />
            </div>
          </span>
        </div>
      </Anchor>
    </Root>
  );
}
