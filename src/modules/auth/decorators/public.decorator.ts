import { SetMetadata } from '@nestjs/common';

import { PUBLIC_KEY } from '../constants/auth.constants';

export const Public = (): ReturnType<typeof SetMetadata> => SetMetadata(PUBLIC_KEY, true);
