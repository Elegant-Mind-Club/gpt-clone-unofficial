import { SelectDropDown, SelectDropDownPop, Switch } from '~/components/ui';

export default function GPTSwitch({ conversation, setOption, models, gpt3Model, gpt4Model }) {
  const onSwitchModels = () => {
    if (conversation?.model === gpt3Model) {
      setOption('model')(gpt4Model);
    } else {
      setOption('model')(gpt3Model);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <span>{conversation?.model === gpt3Model ? 'GPT-3.5' : 'GPT-4'}</span>
      <Switch
        checked={conversation?.model === gpt4Model}
        onCheckedChange={() => {
          onSwitchModels();
        }}
        name={conversation?.model === gpt3Model ? 'GPT-3.5' : 'GPT-4'}
      />
    </div>
  );
}
