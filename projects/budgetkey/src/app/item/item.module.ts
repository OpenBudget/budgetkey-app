import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { BudgetKeyItemService } from './budgetkey-item.service';
import { ItemApiService } from './item-api.service';
import { ItemPageComponent } from './item-page/item-page.component';
import { ItemRoutingModule } from './item-routing.module';
import { QuestionsPanelComponent } from './questions/questions-panel/questions-panel.component';
import { ItemDataTableComponent } from './questions/item-data-table/item-data-table.component';
import { ItemQuestionsParameterComponent } from './questions/item-questions/item-questions-parameter/item-questions-parameter.component';
import { ItemQuestionsComponent } from './questions/item-questions/item-questions.component';
import { BudgetItemComponent } from './items/item-budget/base-budget-item/base-budget-item.component';
import { ItemBudget0digComponent } from './items/item-budget/item-budget0dig/item-budget0dig.component';
import { ItemBudget2digComponent } from './items/item-budget/item-budget2dig/item-budget2dig.component';
import { ItemBudget4digComponent } from './items/item-budget/item-budget4dig/item-budget4dig.component';
import { ItemBudget6digComponent } from './items/item-budget/item-budget6dig/item-budget6dig.component';
import { ItemBudget8digComponent } from './items/item-budget/item-budget8dig/item-budget8dig.component';
import { ItemLinkComponent } from './item-link/item-link.component';
import { ItemBudgetFuncDetailComponent } from './items/item-budget/item-budget-func-detail/item-budget-func-detail.component';
import { ItemBudgetFuncComponent } from './items/item-budget/item-budget-func/item-budget-func.component';
import { BaseSimpleItemComponent } from './items/base-simple-item/base-simple-item.component';
import { ItemVisualizationsComponent } from './charts/item-visualizations/item-visualizations.component';
import { ChartRouterComponent } from './charts/chart-router/chart-router.component';
import { ChartsModule } from '../charts/charts.module';
import { ChartVerticalLayoutComponent } from './charts/chart-vertical-layout/chart-vertical-layout.component';
import { ContractPaymentsComponent } from './charts/contract-payments/contract-payments.component';
import { BaseOrgItemComponent } from './items/base-org-item/base-org-item.component';
import { ItemBudgetChangesComponent } from './items/item-budget-changes/item-budget-changes.component';
import { ItemGovDecisionComponent } from './items/item-gov-decision/item-gov-decision.component';
import { IncomeItemComponent } from './items/item-income/income-item/income-item.component';
import { ItemIncome2digComponent } from './items/item-income/item-income2dig/item-income2dig.component';
import { ItemIncome4digComponent } from './items/item-income/item-income4dig/item-income4dig.component';
import { ItemIncome6digComponent } from './items/item-income/item-income6dig/item-income6dig.component';
import { ItemIncome8digComponent } from './items/item-income/item-income8dig/item-income8dig.component';
import { ItemMuniBudgetComponent } from './items/item-muni-budget/item-muni-budget.component';
import { MuniBudgetLinkComponent } from './items/item-muni-budget/muni-budget-link/muni-budget-link.component';
import { MuniBudgetMinicardComponent } from './items/item-muni-budget/muni-budget-minicard/muni-budget-minicard.component';
import { ItemMuniComponent } from './items/item-muni/item-muni.component';
import { MuniItemTidbitComponent } from './items/item-muni/muni-item-tidbit/muni-item-tidbit.component';
import { ItemAssociationComponent } from './items/item-org/item-association/item-association.component';
import { ItemCompanyComponent } from './items/item-org/item-company/item-company.component';
import { ItemPeopleComponent } from './items/item-people/item-people.component';
import { ItemCallsForBidsComponent } from './items/item-procurement/item-calls-for-bids/item-calls-for-bids.component';
import { ItemContractComponent } from './items/item-procurement/item-contract/item-contract.component';
import { ItemProcurementComponent } from './items/item-procurement/item-procurement.component';
import { ItemSupportCriteriaComponent } from './items/item-procurement/item-support-criteria/item-support-criteria.component';
import { ItemTenderComponent } from './items/item-procurement/item-tender/item-tender.component';
import { TimelinePartComponent } from './items/item-procurement/timeline-part/timeline-part.component';
import { ItemNgoActivityReportComponent } from './items/item-reports/item-ngo-activity-report/item-ngo-activity-report.component';
import { ItemNgoDistrictReportComponent } from './items/item-reports/item-ngo-district-report/item-ngo-district-report.component';
import { ItemReportsComponent } from './items/item-reports/item-reports.component';
import { ItemSocialServiceGovUnitComponent } from './items/item-soproc/item-social-service-gov-unit/item-social-service-gov-unit.component';
import { MultiSelectComponent } from './items/item-soproc/item-social-service-gov-unit/multi-select/multi-select.component';
import { ItemSocialServiceComponent } from './items/item-soproc/item-social-service/item-social-service.component';
import { SocialServiceDataTableComponent } from './items/item-soproc/item-social-service/social-service-data-table/social-service-data-table.component';
import { ItemSupportsComponent } from './items/item-supports/item-supports.component';
import { SearchLinkComponent } from './search-link/search-link.component';
import { ListComponentsModule } from '../list-components/list-components.module';
import { ItemPageHeaderComponent } from './item-page-header/item-page-header.component';

@NgModule({
  declarations: [
    BaseOrgItemComponent,
    BaseSimpleItemComponent,
    BudgetItemComponent,
    ChartRouterComponent,
    ContractPaymentsComponent,
    IncomeItemComponent,
    ItemAssociationComponent,
    ItemBudget0digComponent,
    ItemBudget2digComponent,
    ItemBudget4digComponent,
    ItemBudget6digComponent,
    ItemBudget8digComponent,
    ItemBudgetChangesComponent,
    ItemBudgetFuncComponent,
    ItemBudgetFuncDetailComponent,
    ItemCallsForBidsComponent,
    ItemCompanyComponent,
    ItemContractComponent,
    ItemIncome2digComponent,
    ItemIncome4digComponent,
    ItemIncome6digComponent,
    ItemIncome8digComponent,
    ItemLinkComponent,
    ItemMuniBudgetComponent,
    ItemMuniComponent,
    ItemPageComponent,
    ItemPeopleComponent,
    ItemProcurementComponent,
    ItemSupportCriteriaComponent,
    ItemSupportsComponent,
    ItemTenderComponent,
    ItemVisualizationsComponent,
    MuniBudgetLinkComponent,
    MuniBudgetMinicardComponent,
    MuniItemTidbitComponent,
    SearchLinkComponent,
    TimelinePartComponent,
    ItemGovDecisionComponent,
    ItemSocialServiceComponent,
    ItemSocialServiceGovUnitComponent,
    SocialServiceDataTableComponent,
    MultiSelectComponent,
    QuestionsPanelComponent,
    ItemQuestionsComponent,
    ItemQuestionsParameterComponent,
    ItemDataTableComponent,
    ChartVerticalLayoutComponent,
    ItemNgoActivityReportComponent,
    ItemNgoDistrictReportComponent,
    ItemReportsComponent,
    ItemPageHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ItemRoutingModule,
    CommonComponentsModule,
    ListComponentsModule,
    ChartsModule
  ],
  providers: [
    ItemApiService,
    BudgetKeyItemService,
  ]
})
export class ItemModule { }
