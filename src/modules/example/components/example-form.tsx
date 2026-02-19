import { zodResolver } from '@hookform/resolvers/zod';
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
  const { t } = useTranslation(['common', 'validation']);
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
            label={t('common:navigation.example') + ' Title'}
            error={!!errors.title}
            helperText={errors.title?.message}
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
            label="Description"
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
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
            label="Email"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
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
