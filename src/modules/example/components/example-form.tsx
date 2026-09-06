import { zodResolver } from '@hookform/resolvers/zod';
import type { TOptions } from 'i18next';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AppButton } from '@zidsa/zidmui/components/app-button';
import { AppInputBase } from '@zidsa/zidmui/components/app-input-base';

import Box from '@mui/material/Box';

import type { CreateExampleFormData } from '~/modules/example/schemas/example.schema';
import { createExampleSchema } from '~/modules/example/schemas/example.schema';

//
//

interface ExampleFormProps {
  onSubmit: (data: CreateExampleFormData) => void;
}

export const ExampleForm = ({ onSubmit }: ExampleFormProps) => {
  const { t } = useTranslation(['common', 'pages', 'validation']);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateExampleFormData>({
    resolver: zodResolver(createExampleSchema),
    defaultValues: {
      title: '',
      description: '',
      email: '',
    },
  });

  return (
    <Box
      component="form"
      onSubmit={e => void handleSubmit(onSubmit)(e)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <AppInputBase
            {...field}
            label={t('pages:example.form.title')}
            error={!!errors.title}
            helperText={getValidationMessage(t, errors.title?.message, { min: 3, max: 100 })}
            fullWidth
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <AppInputBase
            {...field}
            label={t('pages:example.form.description')}
            multiline
            rows={3}
            error={!!errors.description}
            helperText={getValidationMessage(t, errors.description?.message, { min: 10, max: 500 })}
            fullWidth
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <AppInputBase
            {...field}
            label={t('pages:example.form.email')}
            type="email"
            error={!!errors.email}
            helperText={getValidationMessage(t, errors.email?.message)}
            fullWidth
          />
        )}
      />
      <AppButton type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
        {t('common:actions.getStarted')}
      </AppButton>
    </Box>
  );
};

const getValidationMessage = (
  t: ReturnType<typeof useTranslation>['t'],
  message: string | undefined,
  values?: TOptions,
) => {
  switch (message) {
    case 'validation:min':
      return t('validation:min', values);
    case 'validation:max':
      return t('validation:max', values);
    case 'validation:email':
      return t('validation:email');
    default:
      return undefined;
  }
};
