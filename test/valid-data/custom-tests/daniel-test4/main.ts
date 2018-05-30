import { IRequestParams, IResponseResult, IJsonRpcRequest, ISchemaRequestParams, ISchemaResponseResult } from '@nightlife/nl-skeletor-rpc/rpc_interfaces'
import { SystemId, IUserNameable, ISystemIdsable, ISystemIdable } from '@nightlife/nl-shared-types/common'
import { IDbFields, ITermable, ILimitable, SortDirection, IOffsetable, IFilterable, ISortable } from '@nightlife/nl-shared-types/db';


export namespace nl_sysconf {
    export namespace list {

        export namespace get_lists {

            export interface list_id {
                /**
                 * @description List ID
                 */
                list_id: string;
            }

            export interface type {
                /**
                 * @description List Type
                 */
                type: string;
            }

            export interface is_schedulable {
                /**
                 * @description Is list schedulable
                 */
                is_schedulable: boolean;
            }

            export interface is_loadable {
                /**
                 * @description Is list loadable
                 */
                is_loadable: boolean;
            }

            export interface is_in_selset {
                /**
                 * @description Is list loadable
                 */
                is_in_selset: boolean;
            }
            export interface group {
                /**
                 * @description Is list loadable
                 */
                group: string;
            }

            export interface description {
                /**
                 * @description Is list loadable
                 */
                description: string;
            }

            export interface is_programmed {
                /**
                 * @description Is list loadable
                 */
                is_programmed: boolean;
            }

            export interface syslist_id {
                /**
                 * @description Syslist ID
                 */
                syslist_id: string;
            }

            export interface is_active {
                /**
                 * @description Is Active
                 */
                is_active: boolean;
            }

            export interface slot {
                /**
                 * @description ...
                 */
                slot: number;
            }

            export interface is_special {
                /**
                 * @description Is Special
                 */
                is_special: boolean;
            }

            export interface num_songs {
                /**
                 * @description Number of songs in the list
                 */
                num_songs: number;
            }

            export interface is_suggestion {
                /**
                 * @description Is Suggestionable
                 */
                is_suggestion: boolean;
            }

            export interface friendly_name {
                /**
                 * @description Friendly Name
                 */
                friendly_name: string;
            }

            export interface ISysListDb extends
                syslist_id,
                ISystemIdable,
                list_id,
                is_active,
                slot,
                is_special,
                group,
                description,
                num_songs,
                is_schedulable,
                is_loadable,
                type,
                is_programmed,
                is_in_selset,
                is_suggestion,
                friendly_name,
                IDbFields
                { }

            export interface IListsable {
                lists: Array<ISysListDb>;
            }

            export type ISysListSort = Partial<Record<keyof ISysListDb, SortDirection>>;

            export interface sort_by {
                sort_by: ISysListSort
            }

            export interface IReq extends
                IRequestParams<IRes>,
                Partial<IFilterable<ISysListDb>>,
                Partial<ILimitable>,
                Partial<IOffsetable>,
                ISystemIdable,
                Partial<sort_by> { //should replace limit and offset with Ipaginatable
            }

            export interface IRes extends IResponseResult, IListsable { }
        }
    }
}