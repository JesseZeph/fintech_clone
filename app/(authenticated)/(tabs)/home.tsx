import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Colors from '@/constants/Colors'
import RoundButton from '@/components/RoundButton'
import DropDown from '@/components/DropDown'
import { useBalanceStore } from '@/store/balance-store'
import { defaultStyles } from '@/constants/Styles'
import { Ionicons } from '@expo/vector-icons'
import WidgetList from '@/components/SortableList/WidgetList'
import { useHeaderHeight } from '@react-navigation/elements'

const Page = () => {
    const { balance, runTransaction, transactions, clearTransactions } = useBalanceStore();
    const headerHeight = useHeaderHeight();
    const onAddMoney = () => {
        runTransaction({
            id: Math.random().toString(),
            amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1),
            date: new Date(),
            title: 'Added Money',
        })
    }
    return (
        <ScrollView style={{ backgroundColor: Colors.background }} contentContainerStyle={{
            paddingTop: headerHeight
        }}>
            <View style={styles.account}>
                <View style={styles.row}>
                    <Text style={styles.balance}>{balance()}</Text>
                    <Text style={styles.currency}>€</Text>
                </View>
            </View>
            <View style={styles.actionRow}>
                <RoundButton title='Add money' icon={'add'} onPress={onAddMoney} />
                <RoundButton title='Exchange' icon={'refresh'} onPress={clearTransactions} />
                <RoundButton title='Details' icon={'list'} />
                <DropDown />
            </View>

            <Text style={defaultStyles.sectionHeader}>Transactions</Text>
            <View style={styles.transactions}>
                {transactions.length === 0 && (<Text style={{ padding: 14, color: Colors.gray }}>No transactions yet</Text>)}

                {transactions.map((transaction) => (
                    <View key={transaction.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <View style={styles.circle}>
                            <Ionicons name={transaction.amount > 0 ? 'add' : 'remove'} size={24} color={Colors.dark} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: '400' }}>{transaction.title}</Text>
                            <Text style={{ color: Colors.gray, fontSize: 12 }}>{new Date(transaction.date).toLocaleString()}</Text>
                        </View>
                        <Text style={{ fontWeight: '400' }}>{transaction.amount}€</Text>
                    </View>
                ))}


            </View>
            <Text style={defaultStyles.sectionHeader}>Widgets</Text>
            <WidgetList />
        </ScrollView>
    )
}

export default Page

const styles = StyleSheet.create({
    account: {
        margin: 80,
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',

    },
    balance: {
        fontSize: 50,
        fontWeight: 'bold'
    },
    currency: {
        fontSize: 20,
        marginLeft: 5,
        fontWeight: '500'
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
        padding: 20,
    },
    transactions: {
        marginHorizontal: 20,
        padding: 14,
        backgroundColor: '#fff',
        borderRadius: 16,
        gap: 20
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center'
    },

})