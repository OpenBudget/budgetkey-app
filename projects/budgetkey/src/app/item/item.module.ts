import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CommonComponentsModule } from '../common-components/common-components.module';
import { ChartRouterComponent } from '../vis/chart-router/chart-router.component';
import { ItemVisualizationsComponent } from '../vis/item-visualizations/item-visualizations.component';
import { BudgetItemComponent } from './items/item-budget/base-budget-item/base-budget-item.component';
import { ItemBudget0digComponent } from './items/item-budget/item-budget0dig/item-budget0dig.component';
import { ItemBudget2digComponent } from './items/item-budget/item-budget2dig/item-budget2dig.component';
import { ItemApiService } from './item-api.service';
import { ItemLinkComponent } from './item-link/item-link.component';
import { ItemPageComponent } from './item-page/item-page.component';
import { ItemRoutingModule } from './item-routing.module';
import { BaseOrgItemComponent } from './items/base-org-item/base-org-item.component';
import { BaseSimpleItemComponent } from './items/base-simple-item/base-simple-item.component';
import { ItemBudget4digComponent } from './items/item-budget/item-budget4dig/item-budget4dig.component';
import { ItemBudget6digComponent } from './items/item-budget/item-budget6dig/item-budget6dig.component';
import { ItemBudget8digComponent } from './items/item-budget/item-budget8dig/item-budget8dig.component';
import { ItemBudgetFuncComponent } from './items/item-budget/item-budget-func/item-budget-func.component';
import { ItemBudgetFuncDetailComponent } from './items/item-budget/item-budget-func-detail/item-budget-func-detail.component';
import { ItemBudgetChangesComponent } from './items/item-budget-changes/item-budget-changes.component';
import { ItemIncome2digComponent } from './items/item-income/item-income2dig/item-income2dig.component';
import { ItemIncome4digComponent } from './items/item-income/item-income4dig/item-income4dig.component';
import { ItemIncome6digComponent } from './items/item-income/item-income6dig/item-income6dig.component';
import { ItemIncome8digComponent } from './items/item-income/item-income8dig/item-income8dig.component';
import { IncomeItemComponent } from './items/item-income/income-item/income-item.component';
import { ItemAssociationComponent } from './items/item-org/item-association/item-association.component';
import { ItemCompanyComponent } from './items/item-org/item-company/item-company.component';
import { ItemMuniComponent } from './items/item-muni/item-muni.component';
import { MuniItemTidbitComponent } from './items/item-muni/muni-item-tidbit/muni-item-tidbit.component';
import { MuniBudgetMinicardComponent } from './items/item-muni-budget/muni-budget-minicard/muni-budget-minicard.component';
import { PlotlyComponent } from './charts/plotly/plotly.component';
import { ItemMuniBudgetComponent } from './items/item-muni-budget/item-muni-budget.component';
import { MuniBudgetLinkComponent } from './items/item-muni-budget/muni-budget-link/muni-budget-link.component';
import { ItemProcurementComponent } from './items/item-procurement/item-procurement.component';
import { ItemContractComponent } from './items/item-procurement/item-contract/item-contract.component';
import { ContractPaymentsComponent } from './charts/contract-payments/contract-payments.component';
import { TimelinePartComponent } from './items/item-procurement/timeline-part/timeline-part.component';
import { ItemTenderComponent } from './items/item-procurement/item-tender/item-tender.component';
import { ItemCallsForBidsComponent } from './items/item-procurement/item-calls-for-bids/item-calls-for-bids.component';
import { ItemSupportCriteriaComponent } from './items/item-procurement/item-support-criteria/item-support-criteria.component';
import { ItemSupportsComponent } from './items/item-supports/item-supports.component';
import { SearchLinkComponent } from './search-link/search-link.component';
import { ItemPeopleComponent } from './items/item-people/item-people.component';
import { ItemGovDecisionComponent } from './items/item-gov-decision/item-gov-decision.component';
import { ItemSocialServiceComponent } from './items/item-soproc/item-social-service/item-social-service.component';
import { ItemSocialServiceGovUnitComponent } from './items/item-soproc/item-social-service-gov-unit/item-social-service-gov-unit.component';
import { SocialServiceDataTableComponent } from './items/item-soproc/item-social-service/social-service-data-table/social-service-data-table.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BudgetKeyItemService } from './budgetkey-item.service';
import { MultiSelectComponent } from './items/item-soproc/item-social-service-gov-unit/multi-select/multi-select.component';
import { QuestionsPanelComponent } from './questions/questions-panel/questions-panel.component';
import { ItemQuestionsComponent } from './questions/item-questions/item-questions.component';
import { ItemQuestionsParameterComponent } from './questions/item-questions/item-questions-parameter/item-questions-parameter.component';
import { ItemDataTableComponent } from './questions/item-data-table/item-data-table.component';



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
    PlotlyComponent,
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
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CommonComponentsModule,
    ItemRoutingModule,
  ],
  providers: [
    ItemApiService,
    BudgetKeyItemService,
  ]
})
export class ItemModule { }
