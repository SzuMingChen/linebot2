
const ctrl= {

    

// *********************************�o���I�F����**********************************************************
    getGroupOrder: async  (req, res)=> {
        const { group_id} = req.body;
        try {
            const result = await orderListModel.getGroupOrder(group_id);//result||false
            if (result === false) return res.json(responeStatus.ORDERLIST_EMPTY_ERROR);//�ݷs�Worder_list
            return res.json(result);
        } catch (error) {
            // �ƻs���n�����~�^��
        }
    },
// *********************************�ϥΪ������q��(�|���T�{)**********************************************************
    closeOrder: async (req, res) => {
        const { group_id, order_id, bind_account_type, bind_account } = req.body;
        try {
            const result = await orderListModel.closeOrder(group_id, order_id, bind_account_type, bind_account);//true||false
            if (!result) return res.json(responeStatus.ORDERLIST_CLOSE_ERROR);//�ݷs�Worder_list
            return res.json(responseStatus.SUCCESS);
        } catch (error) {
            //�ƻs���n�����~�^��
        }
    },

}

// =============================================SQL===============================================//


async function getGroupOrder(group_id) {
    const target = `SELECT * FROM order_list WHERE group_id = ${db.escape(group_id)} AND \`delete\` = 0`;
    console.log(target);
    const [result, field] = await db.query(target);
    if (result?.affectRow !== 0) return result;
    return false;
}

async function closeOrder(group_id, order_id, bind_account_type, bind_account) {
    const target = `UPDATE order_list SET (\`status\`, update_uid) VALUE (${db.escape('2')}, ${db.escape(bind_account_type + '-' + bind_account)} WHERE group_id = ${db.escape(group_id)} AND \`id\` = ${db.escape(order_id)})`;
    console.log(target);
    const [result, field] = await db.query(target);
    if (result?.affectRow !== 0) return true;
    return false;
}



//! �border_info�̭���status���ӬO���|���u������(���ʿ��])���e�����A�A���ʿ��]��N�n��q��令�w�R�������A
