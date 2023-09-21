import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CommonComponentsModule } from '../common-components/common-components.module';
import { ChartRouterComponent } from '../vis/chart-router/chart-router.component';
import { ItemVisualizationsComponent } from '../vis/item-visualizations/item-visualizations.component';
import { BudgetItemComponent } from './items/item-budget/budget-item/budget-item.component';
import { ItemBudget0digComponent } from './items/item-budget/item-budget0dig/item-budget0dig.component';
import { ItemBudget2digComponent } from './items/item-budget/item-budget2dig/item-budget2dig.component';
import { ItemApiService } from './item-api.service';
import { ItemLinkComponent } from './item-link/item-link.component';
import { ItemPageComponent } from './item-page/item-page.component';
import { ItemRoutingModule } from './item-routing.module';
import { OrgItemComponent } from './items/org-item/org-item.component';
import { SimpleItemComponent } from './items/simple-item/simple-item.component';
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



@NgModule({
  declarations: [
    BudgetItemComponent,
    ChartRouterComponent,
    ItemBudget0digComponent,
    ItemBudget2digComponent,
    ItemLinkComponent,
    ItemPageComponent,
    ItemVisualizationsComponent,
    OrgItemComponent,
    SimpleItemComponent,
    ItemBudget4digComponent,
    ItemBudget6digComponent,
    ItemBudget8digComponent,
    ItemBudgetFuncComponent,
    ItemBudgetFuncDetailComponent,
    ItemBudgetChangesComponent,
    ItemIncome2digComponent,
    ItemIncome4digComponent,
    ItemIncome6digComponent,
    ItemIncome8digComponent,
    IncomeItemComponent,
    ItemAssociationComponent,
    ItemCompanyComponent,
    ItemMuniComponent,
    MuniItemTidbitComponent,
    MuniBudgetMinicardComponent,
    PlotlyComponent,
    ItemMuniBudgetComponent,
    MuniBudgetLinkComponent,
    ItemProcurementComponent,
    ItemContractComponent,
    ContractPaymentsComponent,
    TimelinePartComponent,
    ItemTenderComponent,
    ItemCallsForBidsComponent,
    ItemSupportCriteriaComponent,
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    ItemRoutingModule
  ],
  providers: [
    ItemApiService
  ]
})
export class ItemModule { }
