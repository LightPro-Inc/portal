package com.securities.impl;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import com.infrastructure.core.DomainMetadata;
import com.infrastructure.core.EntityBase;
import com.infrastructure.core.UseCode;
import com.infrastructure.datasource.Base;
import com.securities.api.Admin;
import com.securities.api.Company;
import com.securities.api.ContactMetadata;
import com.securities.api.ContactNature;
import com.securities.api.ContactPersonMetadata;
import com.securities.api.ContactRole;
import com.securities.api.ContactSocietyMetadata;
import com.securities.api.Contacts;
import com.securities.api.Feature;
import com.securities.api.FeatureSubscribed;
import com.securities.api.FeatureSubscribedMetadata;
import com.securities.api.Features;
import com.securities.api.Indicator;
import com.securities.api.IndicatorType;
import com.securities.api.Indicators;
import com.securities.api.Log;
import com.securities.api.Membership;
import com.securities.api.MesureUnitMetadata;
import com.securities.api.MesureUnitType;
import com.securities.api.MesureUnits;
import com.securities.api.Module;
import com.securities.api.ModuleType;
import com.securities.api.PaymentModeMetadata;
import com.securities.api.PaymentModeStatus;
import com.securities.api.PaymentModeType;
import com.securities.api.PaymentModes;
import com.securities.api.ProfileFeatureMetadata;
import com.securities.api.ProfileMetadata;
import com.securities.api.Profiles;
import com.securities.api.SequenceMetadata;
import com.securities.api.Sequences;
import com.securities.api.TaxMetadata;
import com.securities.api.Taxes;
import com.securities.api.UserIndicatorMetadata;
import com.securities.api.UserMetadata;

public final class AdminDb extends EntityBase<Admin, UUID> implements Admin {
	
	private final transient Base base;
	private final transient Module origin;
	
	public AdminDb(final Base base, final Module origin){
		super(origin.id());
		this.base = base;
		this.origin = origin;
	}

	@Override
	public Module install() throws IOException {
		
		Module module = origin.install();
		
		// 1 - faire des initialisations du module
		// 1 - 1 - ajouter l'indicateur nombre de contacts à son tableau de bord général
		Indicator item = indicators().get(IndicatorType.NUMBER_OF_CONTACTS.id());
		membership().defaultUser().indicators().add(item);
		
		return new AdminDb(base, module);
	}

	@Override
	public Module uninstall() throws IOException {
		
		// vérifier que aucun module n'est installé
		if(company().modulesInstalled().count() > 1)
			throw new IllegalArgumentException("Vous devez désinstaller les modules installés avant de continuer l'action !"); 
		
		// supprimer les données du modules
				List<DomainMetadata> domains = 
				Arrays.asList(
					UserIndicatorMetadata.create(),
					TaxMetadata.create(),
					MesureUnitMetadata.create(),
					ProfileFeatureMetadata.create(),
					FeatureSubscribedMetadata.create(),
					UserMetadata.create(),
					ProfileMetadata.create(),
					PaymentModeMetadata.create(),
					ContactPersonMetadata.create(),
					ContactSocietyMetadata.create(),
					ContactMetadata.create(),
					SequenceMetadata.create()
				);
		
		for (DomainMetadata domainMetadata : domains) {
			base.deleteAll(domainMetadata);
		}
		
		// finaliser
		Module module = origin.uninstall();
		return new AdminDb(base, module);
	}
	
	@Override
	public Sequences sequences() throws IOException {
		return new SequencesDb(this.base, company());
	}
	
	@Override
	public MesureUnits mesureUnits() throws IOException {
		return new MesureUnitsDb(this.base, company(), MesureUnitType.NONE);
	}
	
	@Override
	public Taxes taxes() throws IOException {
		return new TaxesDb(this.base, company());
	}
	
	@Override
	public Profiles profiles() throws IOException {
		return new ProfilesDb(base, company());
	}

	@Override
	public Membership membership() throws IOException {
		return new MembershipDb(base, this, UseCode.NONE);
	}

	@Override
	public Indicators indicators() throws IOException {
		return origin.indicators();
	}

	@Override
	public PaymentModes paymentModes() throws IOException {
		return new PaymentModesDb(base, this, PaymentModeType.NONE, PaymentModeStatus.NONE);
	}

	@Override
	public Contacts contacts() throws IOException {
		return new ContactsDb(base, company(), ContactNature.NONE, ContactRole.NONE, UseCode.NONE);
	}

	@Override
	public int order() throws IOException {
		return origin.order();
	}

	@Override
	public String name() throws IOException {
		return origin.name();
	}

	@Override
	public String shortName() throws IOException {
		return origin.shortName();
	}

	@Override
	public String description() throws IOException {
		return origin.description();
	}

	@Override
	public Company company() throws IOException {
		return origin.company();
	}

	@Override
	public boolean isSubscribed() {
		return origin.isSubscribed();
	}

	@Override
	public boolean isActive() {
		return origin.isActive();
	}

	@Override
	public boolean isInstalled() {
		return origin.isInstalled();
	}

	@Override
	public ModuleType type() throws IOException {
		return origin.type();
	}

	@Override
	public void activate(boolean active) throws IOException {
		origin.activate(active);
	}

	@Override
	public void unsubscribeTo(Feature feature) throws IOException {
		origin.unsubscribeTo(feature);
	}

	@Override
	public Module subscribe() throws IOException {
		Module module = origin.subscribe();
		return new AdminDb(base, module);
	}

	@Override
	public Module unsubscribe() throws IOException {
		Module module = origin.unsubscribe();
		return new AdminDb(base, module);
	}

	@Override
	public FeatureSubscribed subscribeTo(Feature feature) throws IOException {
		return origin.subscribeTo(feature);
	}

	@Override
	public Features featuresSubscribed() throws IOException {
		return origin.featuresSubscribed();
	}

	@Override
	public Features featuresAvailable() throws IOException {
		return origin.featuresAvailable();
	}

	@Override
	public Features featuresProposed() throws IOException {
		return origin.featuresProposed();
	}

	@Override
	public Log log() throws IOException {
		return origin.log();
	}
}
