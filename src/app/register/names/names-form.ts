import { YourNameForm } from './your-name/your-name-form';
import { PreviousNameForm } from './previous-name/previous-name-form';
import { SubFormTemplate, FormFactory } from 'fully-formed';

class NameTemplate extends SubFormTemplate {
  public readonly name = 'names';
  public readonly id = 'voter-registration/names';
  public readonly fields = [new YourNameForm(), new PreviousNameForm()];
}

export const NamesForm = FormFactory.createSubForm(NameTemplate);
