import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePhishingAttemptDto } from './dto/create-phishing-attempt.dto';
import { UpdatePhishingAttemptDto } from './dto/update-phising-attempt.dto';
import { PhishingAttempt, User } from '@phishing-simulation/types';

@Injectable()
export class PhishingAttemptsService {
  private readonly logger: Logger = new Logger(PhishingAttemptsService.name);

  constructor(
    @InjectModel('PhishingAttempt')
    private phishingAttemptModel: Model<PhishingAttempt>,
  ) {}

  async create(
    createPhishingAttemptDto: CreatePhishingAttemptDto,
    userId: string,
  ): Promise<PhishingAttempt> {
    try {
      const phishingAttempt = new this.phishingAttemptModel({
        ...createPhishingAttemptDto,
        createdBy: userId,
        status: 'PENDING',
      });

      return await phishingAttempt.save();
    } catch (error) {
      this.logger.error('Failed to create phishing attempt', error);
      throw error;
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    user?: User,
  ): Promise<{
    attempts: PhishingAttempt[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const filter = user?.role === 'ADMIN' ? {} : { createdBy: user?.id };

    const total = await this.phishingAttemptModel.countDocuments(filter);
    const attempts = await this.phishingAttemptModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      attempts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, user: User): Promise<PhishingAttempt> {
    const attempt = await this.phishingAttemptModel.findById(id);

    if (!attempt) {
      throw new NotFoundException('Phishing attempt not found');
    }

    if (user.role !== 'ADMIN' && attempt?.createdBy?.toString() !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to view this attempt',
      );
    }

    return attempt;
  }

  async update(
    id: string,
    updatePhishingAttemptDto: UpdatePhishingAttemptDto,
    user: User,
  ): Promise<PhishingAttempt | null> {
    const existingAttempt = await this.phishingAttemptModel.findById(id);

    if (!existingAttempt) {
      throw new NotFoundException('Phishing attempt not found');
    }

    if (
      user.role !== 'ADMIN' &&
      existingAttempt.createdBy?.toString() !== user.id
    ) {
      throw new ForbiddenException(
        'You are not authorized to update this attempt',
      );
    }

    return this.phishingAttemptModel.findByIdAndUpdate(
      id,
      updatePhishingAttemptDto,
      { new: true, runValidators: true },
    );
  }
}
