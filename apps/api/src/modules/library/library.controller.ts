import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { SearchPeptidesDto } from './dto';

@ApiTags('library')
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('peptides')
  @ApiOperation({ summary: 'Search and filter peptides' })
  @ApiResponse({ status: 200, description: 'Paginated list of peptides' })
  async searchPeptides(@Query() dto: SearchPeptidesDto) {
    return {
      success: true,
      data: await this.libraryService.searchPeptides(dto),
    };
  }

  @Get('peptides/:slug')
  @ApiOperation({ summary: 'Get peptide details by slug' })
  @ApiParam({ name: 'slug', description: 'Peptide URL slug' })
  @ApiResponse({ status: 200, description: 'Full peptide details with lanes, contraindications, and interactions' })
  @ApiResponse({ status: 404, description: 'Peptide not found' })
  async getPeptide(@Param('slug') slug: string) {
    return {
      success: true,
      data: await this.libraryService.getPeptideBySlug(slug),
    };
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all peptide categories' })
  @ApiResponse({ status: 200, description: 'List of categories with peptide counts' })
  async listCategories() {
    return {
      success: true,
      data: await this.libraryService.listCategories(),
    };
  }
}
