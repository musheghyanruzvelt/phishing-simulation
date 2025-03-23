import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreatePhishingAttemptDto } from './dto/create-phishing-attempt.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PhishingAttemptsService } from './phishing-attempts.service';
import { UpdatePhishingAttemptDto } from './dto/update-phising-attempt.dto';
import { User } from '@phishing-simulation/types';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('phishing-attempts')
@UseGuards(JwtAuthGuard)
export class PhishingAttemptsController {
  constructor(
    private readonly phishingAttemptsService: PhishingAttemptsService,
  ) {}

  @Post()
  create(
    @Body() createPhishingAttemptDto: CreatePhishingAttemptDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.phishingAttemptsService.create(
      createPhishingAttemptDto,
      req.user.id as string,
    );
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.phishingAttemptsService.findAll(
      Number(page),
      Number(limit),
      req.user,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.phishingAttemptsService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePhishingAttemptDto: UpdatePhishingAttemptDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.phishingAttemptsService.update(
      id,
      updatePhishingAttemptDto,
      req.user,
    );
  }
}
