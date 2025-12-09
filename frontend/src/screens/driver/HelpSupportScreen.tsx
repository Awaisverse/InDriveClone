import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
}

export default function HelpSupportScreen() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'How do I accept a ride request?',
      answer: 'When you receive a ride request, you can tap "Accept" to take the ride. Make sure you\'re online and ready to drive.',
      expanded: false,
    },
    {
      id: '2',
      question: 'How are earnings calculated?',
      answer: 'Earnings are calculated based on distance, time, and base fare. You receive a percentage of the total fare.',
      expanded: false,
    },
    {
      id: '3',
      question: 'What if I need to cancel a ride?',
      answer: 'You can cancel a ride before starting it. Frequent cancellations may affect your rating.',
      expanded: false,
    },
  ]);

  const [contactMessage, setContactMessage] = useState('');

  const toggleFAQ = (id: string) => {
    setFaqs(prev =>
      prev.map(faq => (faq.id === id ? { ...faq, expanded: !faq.expanded } : faq))
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionText}>Call Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Live Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📧</Text>
            <Text style={styles.actionText}>Email Us</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(faq.id)}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Text style={styles.faqIcon}>{faq.expanded ? '▼' : '▶'}</Text>
              </TouchableOpacity>
              {faq.expanded && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Form */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Describe your issue..."
            multiline
            numberOfLines={6}
            value={contactMessage}
            onChangeText={setContactMessage}
            placeholderTextColor="#999"
          />
          <Button
            title="Send Message"
            onPress={() => {
              // TODO: Send message
              setContactMessage('');
            }}
            variant="primary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  faqSection: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  faqItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  faqIcon: {
    fontSize: 12,
    color: '#666',
  },
  faqAnswer: {
    paddingTop: 10,
    paddingBottom: 5,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactSection: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 14,
    color: '#000',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
});

