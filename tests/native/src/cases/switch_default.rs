use relm4::prelude::*;

pub struct SwitchDefault;

#[relm4::component(pub)]
impl SimpleComponent for SwitchDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Switch {}
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
